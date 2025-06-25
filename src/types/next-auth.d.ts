import { DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: "PARENT" | "TEACHER" | "DIRECTOR" | "SUPER_ADMIN";
      tenantId: string;
      firstName?: string;
      lastName?: string;
      phone?: string | null;
      civility?: string | null;
    };
  }

  interface User extends DefaultUser {
    id: string;
    email: string;
    role: "PARENT" | "TEACHER" | "DIRECTOR" | "SUPER_ADMIN";
    tenantId: string;
    firstName?: string;
    lastName?: string;
    phone?: string | null;
    civility?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    user?: {
      id: string;
      email: string;
      role: "PARENT" | "TEACHER" | "DIRECTOR" | "SUPER_ADMIN";
      tenantId: string;
      firstName?: string;
      lastName?: string;
      phone?: string | null;
      civility?: string | null;
    };
  }
}
