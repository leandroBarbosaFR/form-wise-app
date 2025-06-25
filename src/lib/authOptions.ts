import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import type { AuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";

type UserRole = "PARENT" | "TEACHER" | "DIRECTOR";

interface AppUser {
  id: string;
  email: string;
  role: UserRole;
  phone: string;
  rememberMe?: boolean;
  firstName?: string;
  lastName?: string;
  civility?: string | null;
  tenantId: string;

  subscriptionStatus?: "ACTIVE" | "FREE_TRIAL" | "EXPIRED";
  trialEndsAt?: string | null;
}

interface AppToken extends JWT {
  user?: AppUser;
  rememberMe?: boolean;
}

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Rester connecté", type: "checkbox" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: { tenant: true },
          });

          if (!user || !user.password) return null;

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValid) return null;

          return {
            id: user.id,
            email: user.email,
            role: user.role,
            tenantId: user.tenantId!,
            rememberMe: credentials.rememberMe === "true",
            firstName: user.firstName ?? undefined,
            lastName: user.lastName ?? undefined,
            civility: user.civility ?? undefined,
            phone: user.phone ?? undefined,
            subscriptionStatus: user.tenant?.subscriptionStatus ?? "FREE_TRIAL",
            trialEndsAt: user.tenant?.trialEndsAt?.toISOString() ?? null,
          } as AppUser;
        } catch (error) {
          console.error("❌ Erreur dans authorize:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      console.log("➡️ signIn callback, user:", user);
      return true;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async jwt({ token, user, trigger, session }) {
      const typedToken = token as AppToken;

      // Initial sign in
      if (user) {
        typedToken.user = user as AppUser;
        typedToken.rememberMe = (user as AppUser).rememberMe ?? true;
        if (!typedToken.rememberMe) {
          typedToken.exp = Math.floor(Date.now() / 1000) + 60 * 60 * 4;
        }
      }

      // ✅ Mise à jour après paiement
      if (trigger === "update" && typedToken.user?.tenantId) {
        const tenant = await prisma.tenant.findUnique({
          where: { id: typedToken.user.tenantId },
        });

        const isValidStatus = (
          status: string
        ): status is "ACTIVE" | "FREE_TRIAL" | "EXPIRED" =>
          ["ACTIVE", "FREE_TRIAL", "EXPIRED"].includes(status);

        if (tenant) {
          const status = tenant.subscriptionStatus;

          if (status && isValidStatus(status)) {
            typedToken.user.subscriptionStatus = status;
          } else {
            typedToken.user.subscriptionStatus = "FREE_TRIAL";
          }

          typedToken.user.trialEndsAt =
            tenant.trialEndsAt?.toISOString() ?? null;
        }
      }

      return typedToken;
    },

    session({ session, token }) {
      const user = (token as AppToken).user;
      if (user && session.user) {
        session.user.id = user.id;
        session.user.email = user.email;
        session.user.role = user.role;
        session.user.firstName = user.firstName;
        session.user.lastName = user.lastName;
        session.user.phone = user.phone;
        session.user.civility = user.civility;
        session.user.tenantId = user.tenantId;
        session.user.subscriptionStatus = user.subscriptionStatus;
        session.user.trialEndsAt = user.trialEndsAt;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
