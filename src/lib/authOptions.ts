import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import type { AuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";

type UserRole = "PARENT" | "TEACHER" | "DIRECTOR" | "SUPER_ADMIN" | "STAFF";

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
  billingPlan?: string;
  trialEndsAt?: string | null;
  schoolCode?: string | null;
}

interface AppToken extends JWT {
  user?: AppUser;
  role?: UserRole;
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

        const allowedRoles: UserRole[] = [
          "PARENT",
          "TEACHER",
          "DIRECTOR",
          "STAFF",
          "SUPER_ADMIN",
        ];

        if (!user || !allowedRoles.includes(user.role)) return null;
        if (!user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          phone: user.phone ?? "",
          tenantId: user.tenantId!,
          rememberMe:
            credentials.rememberMe === "true" ||
            credentials.rememberMe === "on",
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
          civility: user.civility ?? null,
          schoolCode: user.tenant?.schoolCode ?? null,
          subscriptionStatus: user.tenant?.subscriptionStatus ?? "FREE_TRIAL",
          billingPlan: user.tenant?.billingPlan ?? "MONTHLY",
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

    async jwt({ token, user }) {
      const typedToken = token as AppToken;

      if (user) {
        console.log("👤 New user login detected");

        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: { tenant: true },
        });

        if (dbUser) {
          const userPayload: AppUser = {
            id: dbUser.id,
            email: dbUser.email,
            role: dbUser.role as UserRole,
            phone: dbUser.phone ?? "",
            tenantId: dbUser.tenantId!,
            rememberMe: (user as AppUser).rememberMe ?? true,
            firstName: dbUser.firstName ?? "",
            lastName: dbUser.lastName ?? "",
            civility: dbUser.civility ?? null,
            schoolCode: dbUser.tenant?.schoolCode ?? null,
            subscriptionStatus:
              (dbUser.tenant
                ?.subscriptionStatus as AppUser["subscriptionStatus"]) ??
              "FREE_TRIAL",
            billingPlan: dbUser.tenant?.billingPlan ?? "MONTHLY",
            trialEndsAt: dbUser.tenant?.trialEndsAt?.toISOString() ?? null,
          };

          typedToken.user = userPayload;
          typedToken.role = dbUser.role;
        }

        if (!typedToken.rememberMe) {
          typedToken.exp = Math.floor(Date.now() / 1000) + 4 * 60 * 60;
        }
      }

      // ✅ Fallback: garder l'ancien user si non connecté à nouveau
      if (!typedToken.user && (token as AppToken).user) {
        typedToken.user = (token as AppToken).user;
        typedToken.role = (token as AppToken).role ?? typedToken?.user?.role;
      }

      return typedToken;
    },

    session({ session, token }) {
      const appToken = token as AppToken;
      const user = appToken.user;

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
        session.user.billingPlan = user.billingPlan ?? "MONTHLY";
        session.user.trialEndsAt = user.trialEndsAt ?? null;
        session.user.schoolCode = user.schoolCode ?? null;

        console.log("📦 Final session user:", session.user);
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
