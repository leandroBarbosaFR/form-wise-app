import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import AuthProvider from "../providers/AuthProvider";
import { Toaster } from "sonner";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/authOptions";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;

  let roleTitle = "";
  if (role === "DIRECTOR") roleTitle = " | Director";
  else if (role === "TEACHER") roleTitle = " | Teacher";
  else if (role === "PARENT") roleTitle = " | Parent";

  return {
    title: `Form Wise app${roleTitle}`,
    description: "Form Wise app",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
