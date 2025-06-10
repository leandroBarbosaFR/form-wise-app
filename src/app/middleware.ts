import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const pathname = req.nextUrl.pathname;

      if (!token) return false;

      if (pathname.startsWith("/dashboard/director")) {
        return token.role === "DIRECTOR";
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
  matcher: ["/dashboard/:path*"],
};
