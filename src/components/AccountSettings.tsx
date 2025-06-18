"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import CenteredSpinner from "./CenteredSpinner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface UserData {
  firstName: string;
  lastName: string;
  phone?: string;
  email: string;
}

export default function AccountSettings() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const { data: session, update } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        if (data?.user) {
          setUser(data.user);
          setFirstName(data.user.firstName || "");
          setLastName(data.user.lastName || "");
          setPhone(data.user.phone || "");
        }
      } catch (error) {
        console.log("Erreur lors du chargement des données.", error);
        toast.error("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const res = await fetch("/api/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, phone }),
      });

      const data = await res.json();

      if (res.ok) {
        // Update local state
        setUser((prev) =>
          prev ? { ...prev, firstName, lastName, phone } : null
        );

        // Force session update with new data
        await update({
          ...session,
          user: {
            ...session?.user,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            phone: data.user.phone,
          },
        });

        // Optional: Force a router refresh to update all components
        router.refresh();

        toast.success("Informations mises à jour !");
      } else {
        toast.error(data?.error || "Échec de la mise à jour.");
      }
    } catch (error) {
      console.log("Erreur réseau.", error);
      toast.error("Erreur réseau.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <CenteredSpinner label="Chargement..." />;
  if (!user) return <p>Aucune donnée utilisateur trouvée.</p>;

  return (
    <div className="max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium">Prénom</label>
        <Input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Nom</label>
        <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </div>

      <div>
        <label className="block text-sm font-medium">Téléphone</label>
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <div>
        <label className="block text-sm font-medium">
          Email (non modifiable)
        </label>
        <Input value={user.email} disabled />
      </div>

      <Button onClick={handleUpdate} disabled={updating}>
        {updating ? "Mise à jour..." : "Enregistrer"}
      </Button>
    </div>
  );
}
