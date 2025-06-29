"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Zap } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CreatePasswordClient() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/create-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      toast.success("Mot de passe créé avec succès !");
      router.push("/login");
    } else {
      setError(data.error || "Erreur");
    }
  };

  if (!token) {
    return (
      <div className="text-center py-20 text-red-600 text-lg font-semibold">
        Token invalide ou manquant
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 h-full pt-[300px] pb-[300px] relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2">
          <Link href="/" className="flex justify-center items-center gap-2">
            <Zap className="text-indigo-600" />
            <h1 className="text-xl font-bold text-gray-900">Formwise</h1>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
          Créer votre mot de passe
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900"
              >
                Mot de passe
              </label>
              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-2 pr-10 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 cursor-pointer"
                  aria-label="Afficher ou masquer le mot de passe"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer"
            >
              {loading ? "Création..." : "Créer le mot de passe"}
            </Button>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Vous avez déjà un compte ?{" "}
            <Link
              href="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
