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
  schoolCode?: string | null;
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
        console.log(
          "📦 user.tenant.schoolCode from authorize:",
          user?.tenant?.schoolCode
        );
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
          rememberMe:
            credentials.rememberMe === "true" ||
            credentials.rememberMe === "on",
          firstName: user.firstName ?? undefined,
          lastName: user.lastName ?? undefined,
          civility: user.civility ?? undefined,
          schoolCode: user.tenant?.schoolCode ?? null,
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
      const typedToken = token as AppToken;

      console.log("🔥 JWT callback triggered with:", {
        trigger,
        hasUser: !!user,
        tokenUserId: typedToken.user?.id,
      });

      // ➤ Première connexion
      if (user) {
        console.log("👤 New user login detected");
        typedToken.user = user as AppUser;
        typedToken.rememberMe = (user as AppUser).rememberMe ?? true;

        if (!typedToken.rememberMe) {
          typedToken.exp = Math.floor(Date.now() / 1000) + 4 * 60 * 60;
        }
      }

      // ➤ Rafraîchissement manuel ou automatique
      if ((trigger === "update" || !user) && typedToken.user?.tenantId) {
        console.log(
          "🔄 Trigger is 'update' or user is undefined → refresh tenant data"
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

            typedToken.user.subscriptionStatus = newStatus;
            typedToken.user.trialEndsAt =
              tenant.trialEndsAt?.toISOString() ?? null;
            typedToken.user.schoolCode = tenant.schoolCode ?? null;

            console.log("✅ Token refreshed from DB:", {
              tenantId: tenant.id,
              subscriptionStatus: newStatus,
              trialEndsAt: tenant.trialEndsAt,
              schoolCode: tenant.schoolCode,
            });
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
        session.user.schoolCode = user.schoolCode ?? null;

        console.log("📦 Final session user:", session.user);
        console.log("📦 Final session schoolCode:", user.schoolCode);
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
