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
  rememberMe?: boolean;
  firstName?: string;
  lastName?: string;
}

interface AppToken extends JWT {
  user?: AppUser;
  rememberMe?: boolean;
}

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma) as Adapter,
  session: { strategy: "jwt" },
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
          rememberMe: credentials.rememberMe === "true",
          firstName: user.firstName,
          lastName: user.lastName,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const typedToken = token as AppToken;
      if (user) {
        typedToken.user = user as AppUser;
        typedToken.rememberMe = (user as AppUser).rememberMe ?? true;
        if (!typedToken.rememberMe) {
          typedToken.exp = Math.floor(Date.now() / 1000) + 60 * 60 * 4;
        }
      }
      return typedToken;
    },
    async session({ session, token }) {
      const typedToken = token as AppToken;
      if (typedToken.user) {
        session.user = typedToken.user;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
