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
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Rester connecté", type: "checkbox" },
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      authorize: async (credentials, _req) => {
        console.log("Tentative de connexion avec :", credentials);

        if (!credentials?.email || !credentials?.password) return null;

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.password) return null;

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValid) return null;

          console.log("✅ Returning user:", {
            id: user.id,
            email: user.email,
            role: user.role,
          });

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
          };
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

      // Handle session updates (when update() is called)
      if (trigger === "update" && session) {
        // Merge the updated session data
        if (typedToken.user && session.user) {
          typedToken.user = {
            ...typedToken.user,
            ...session.user,
          };
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
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
