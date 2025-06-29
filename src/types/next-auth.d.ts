import { DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: "PARENT" | "TEACHER" | "DIRECTOR" | "SUPER_ADMIN" | "STAFF";
      tenantId: string | null;
      firstName?: string;
      lastName?: string;
      phone?: string | null;
      civility?: string | null;
      subscriptionStatus?: "ACTIVE" | "FREE_TRIAL" | "EXPIRED";
      trialEndsAt?: string | null;
      schoolCode?: string | null;
      billingPlan?: string;
    };
  }

  interface User extends DefaultUser {
    id: string;
    email: string;
    role: "PARENT" | "TEACHER" | "DIRECTOR" | "SUPER_ADMIN" | "STAFF";
    tenantId: string | null;
    firstName?: string;
    lastName?: string;
    phone?: string | null;
    civility?: string | null;
    subscriptionStatus?: "ACTIVE" | "FREE_TRIAL" | "EXPIRED";
    trialEndsAt?: string | null;
    schoolCode?: string | null;
    billingPlan?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    user?: {
      id: string;
      email: string;
      role: "PARENT" | "TEACHER" | "DIRECTOR" | "SUPER_ADMIN" | "STAFF";
      tenantId: string | null;
      firstName?: string;
      lastName?: string;
      phone?: string | null;
      civility?: string | null;
      subscriptionStatus?: "ACTIVE" | "FREE_TRIAL" | "EXPIRED";
      trialEndsAt?: string | null;
      schoolCode?: string | null;
      billingPlan?: string;
    };
  }
}
