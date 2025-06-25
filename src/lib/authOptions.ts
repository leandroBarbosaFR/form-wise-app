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
  tenantId: string;
  rememberMe?: boolean;
  firstName?: string;
  lastName?: string;
  civility?: string | null;
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
          phone: user.phone ?? undefined,
          tenantId: user.tenantId!,
          rememberMe: credentials.rememberMe === "true",
          firstName: user.firstName ?? undefined,
          lastName: user.lastName ?? undefined,
          civility: user.civility ?? undefined,
          subscriptionStatus: user.tenant?.subscriptionStatus ?? "FREE_TRIAL",
          trialEndsAt: user.tenant?.trialEndsAt?.toISOString() ?? null,
        } as AppUser;
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      console.log("➡️ signIn callback:", user?.email);
      return true;
    },
    async jwt({ token, user, trigger }) {
      console.log("🔥 JWT callback triggered with:", {
        trigger,
        hasUser: !!user,
        tokenUserId: (token as AppToken).user?.id,
      });

      const typedToken = token as AppToken;

      // Première connexion
      if (user) {
        console.log("👤 New user login detected");
        typedToken.user = user as AppUser;
        typedToken.rememberMe = (user as AppUser).rememberMe ?? true;

        // Si l'utilisateur n'a pas coché "se souvenir de moi"
        if (!typedToken.rememberMe) {
          typedToken.exp = Math.floor(Date.now() / 1000) + 4 * 60 * 60; // 4h
        }
      }

      // ALWAYS refresh tenant data when update is triggered AND we have an existing user token
      if (trigger === "update" && typedToken.user?.tenantId) {
        console.log(
          "🔄 UPDATE triggered - Refreshing tenant data for:",
          typedToken.user.tenantId
        );

        try {
          const tenant = await prisma.tenant.findUnique({
            where: { id: typedToken.user.tenantId },
          });

          if (tenant) {
            const validStatuses = ["ACTIVE", "FREE_TRIAL", "EXPIRED"];
            const status = tenant.subscriptionStatus ?? "";

            const newStatus = validStatuses.includes(status)
              ? (status as AppUser["subscriptionStatus"])
              : "FREE_TRIAL";

            console.log("🔍 Database status:", status);
            console.log(
              "🔍 Current token status:",
              typedToken.user.subscriptionStatus
            );
            console.log("🔍 New status:", newStatus);

            // Force update the token
            typedToken.user = {
              ...typedToken.user,
              subscriptionStatus: newStatus,
              trialEndsAt: tenant.trialEndsAt?.toISOString() ?? null,
            };

            console.log(
              "✅ Token updated with new subscription status:",
              typedToken.user.subscriptionStatus
            );
          } else {
            console.warn("⚠️ Tenant not found in database");
          }
        } catch (error) {
          console.error("❌ Error refreshing tenant data:", error);
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
        session.user.phone = user.phone;
        session.user.civility = user.civility;
        session.user.firstName = user.firstName;
        session.user.lastName = user.lastName;
        session.user.tenantId = user.tenantId;
        session.user.subscriptionStatus =
          user.subscriptionStatus ?? "FREE_TRIAL";
        session.user.trialEndsAt = user.trialEndsAt ?? null;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
