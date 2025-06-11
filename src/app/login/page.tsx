import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Form Wise app | Connexion",
  description: "Connexion à Form Wise",
};

export default function RegisterPage() {
  return <LoginForm />;
}
