import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import { prisma } from "../../../../lib/prisma"; // db
import bcrypt from "bcryptjs"; // library to hash the password
import type { AdapterUser } from "next-auth/adapters";
import type { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials): Promise<AdapterUser | null> => {
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
          email: user.email!,
          name: null,
          image: null,
          emailVerified: null,
          role: user.role as "PARENT" | "TEACHER" | "DIRECTOR",
        } as AdapterUser & { role: "PARENT" | "TEACHER" | "DIRECTOR" };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = await prisma.user.findUnique({
          where: { email: user.email! },
        });
        if (u) token.role = u.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as "PARENT" | "TEACHER" | "DIRECTOR";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // page de login custom
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
