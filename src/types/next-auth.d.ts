import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      role: "PARENT" | "TEACHER" | "DIRECTOR";
    };
  }

  interface User {
    role: "PARENT" | "TEACHER" | "DIRECTOR";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "PARENT" | "TEACHER" | "DIRECTOR";
  }
}
