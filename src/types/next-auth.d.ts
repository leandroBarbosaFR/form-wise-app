import { DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: "PARENT" | "TEACHER" | "DIRECTOR";
      firstName?: string;
      lastName?: string;
    };
  }

  interface User extends DefaultUser {
    id: string;
    email: string;
    role: "PARENT" | "TEACHER" | "DIRECTOR";
    firstName?: string;
    lastName?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    user?: {
      id: string;
      email: string;
      role: "PARENT" | "TEACHER" | "DIRECTOR";
      firstName?: string;
      lastName?: string;
    };
  }
}
