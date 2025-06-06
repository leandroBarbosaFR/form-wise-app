import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const pathname = req.nextUrl.pathname;

      // Si pas connecté du tout
      if (!token) return false;

      // Restriction pour /dashboard/director/*
      if (pathname.startsWith("/dashboard/director")) {
        return token.role === "DIRECTOR";
      }

      // Accès autorisé pour tous les autres dashboards
      return true;
    },
  },
  pages: {
    signIn: "/login",
    error: "/unauthorized", // Crée cette page si tu veux afficher un message d'erreur
  },
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
