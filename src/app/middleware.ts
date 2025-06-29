import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const pathname = req.nextUrl.pathname;

      if (!token) return false;

      // Protection pour directeur
      if (pathname.startsWith("/dashboard/director")) {
        return token.role === "DIRECTOR";
      }

      // Protection pour parent
      if (pathname.startsWith("/dashboard/parent")) {
        return token.role === "PARENT";
      }

      // Protection pour professeur
      if (pathname.startsWith("/dashboard/teacher")) {
        return token.role === "TEACHER";
      }

      // Protection pour super admin
      if (pathname.startsWith("/admin/dashboard")) {
        return token.role === "SUPER_ADMIN";
      }

      // Dashboard général accessible à tous les rôles connectés
      if (pathname.startsWith("/dashboard")) {
        return !!token;
      }

      return true;
    },
  },
  pages: {
    signIn: "/login",
    error: "/unauthorized",
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
