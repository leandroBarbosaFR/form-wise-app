"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Check, X, Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  desiredClass: string;
  status: string;
}

interface Documents {
  motivationLetterUrl: string;
  schoolResultsUrl: string;
  familyBookUrl: string;
}

interface ParentEntry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  children: Child[];
  documents: Documents;
}

export default function PendingPreinscriptionsTable() {
  const [preinscriptions, setPreinscriptions] = useState<ParentEntry[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/pending-preinscriptions");
      if (!res.ok)
        return toast.error("Erreur lors du chargement des préinscriptions.");
      const data = await res.json();
      setPreinscriptions(data);
    };

    fetchData();
  }, []);

  const handleDecision = async (
    childId: string,

    decision: "ACCEPTED" | "REJECTED"
  ) => {
    console.log("📦 Envoi décision pour enfant :", childId);
    const res = await fetch("/api/validate-preinscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ childId, decision }),
    });

    if (!res.ok) return toast.error("Erreur lors de l'envoi de la décision");
    toast.success(`Élève ${decision === "ACCEPTED" ? "accepté" : "refusé"}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("Copié dans le presse-papiers");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Inscriptions en attente</h2>

      <table className="min-w-full text-sm border rounded overflow-hidden">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Nom complet</th>
            <th className="p-3">Email</th>
            <th className="p-3">Téléphone</th>
            <th className="p-3">Classe souhaitée</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {preinscriptions.map((entry) => (
            <React.Fragment key={entry.id}>
              <>
                <tr key={entry.id} className="border-b">
                  <td className="p-3 font-medium">
                    {entry.firstName} {entry.lastName}
                  </td>
                  <td className="p-3">
                    {entry.email}
                    <Copy
                      className="inline w-4 h-4 ml-1 cursor-pointer text-muted-foreground"
                      onClick={() => copyToClipboard(entry.email)}
                    />
                  </td>
                  <td className="p-3">
                    {entry.phone}
                    <Copy
                      className="inline w-4 h-4 ml-1 cursor-pointer text-muted-foreground"
                      onClick={() => copyToClipboard(entry.phone)}
                    />
                  </td>
                  <td className="p-3">
                    {entry.children?.[0]?.desiredClass || "—"}
                  </td>
                  <td className="p-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setExpanded(expanded === entry.id ? null : entry.id)
                      }
                      className="cursor-pointer"
                    >
                      <Eye className="w-5 h-5" />
                    </Button>
                  </td>
                </tr>
                {expanded === entry.id && (
                  <tr className="bg-muted/30">
                    <td colSpan={5} className="p-4">
                      <div className="mb-4 flex justify-end">
                        <Button
                          variant="default"
                          size="sm"
                          className="cursor-pointer"
                          disabled={entry.children.every(
                            (child) => child.status !== "PENDING"
                          )}
                          onClick={() =>
                            Promise.all(
                              entry.children
                                .filter((child) => child.status === "PENDING")
                                .map((child) =>
                                  handleDecision(child.id, "ACCEPTED")
                                )
                            )
                          }
                        >
                          Accepter tous
                        </Button>
                      </div>
                      <ul className="space-y-4">
                        {entry.children.map((child) => (
                          <li
                            key={child.id}
                            className="border p-4 rounded bg-white flex flex-col sm:flex-row justify-between items-start gap-4"
                          >
                            <div className="space-y-1">
                              <p className="font-semibold">
                                👦 {child.firstName} {child.lastName} (
                                {child.gender})
                              </p>
                              <p>Classe souhaitée : {child.desiredClass}</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="secondary"
                                    className="cursor-pointer"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogTitle>
                                    Détails de l&apos;élève
                                  </DialogTitle>
                                  <div className="space-y-2 text-sm text-muted-foreground">
                                    <p>
                                      <strong>Nom :</strong> {child.firstName}{" "}
                                      {child.lastName}
                                    </p>
                                    <p>
                                      <strong>Genre :</strong> {child.gender}
                                    </p>
                                    <p>
                                      <strong>Classe :</strong>{" "}
                                      {child.desiredClass}
                                    </p>
                                    <div className="pt-2 border-t">
                                      <h4 className="font-semibold mb-1">
                                        Documents :
                                      </h4>
                                      <ul className="list-disc pl-5 text-sm">
                                        <li>
                                          Lettre de motivation :
                                          <a
                                            className="text-grey-600 underline ml-1"
                                            href={
                                              entry.documents
                                                ?.motivationLetterUrl
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            Voir
                                          </a>
                                        </li>
                                        <li>
                                          Résultats scolaires :
                                          <a
                                            className="text-grey-600 underline ml-1"
                                            href={
                                              entry.documents?.schoolResultsUrl
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            Voir
                                          </a>
                                        </li>
                                        <li>
                                          Livret de famille :
                                          <a
                                            className="text-grey-600 underline ml-1"
                                            href={
                                              entry.documents?.familyBookUrl
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            Voir
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>

                              {child.status === "PENDING" ? (
                                <>
                                  <Button
                                    size="sm"
                                    variant="default"
                                    className="cursor-pointer"
                                    onClick={() =>
                                      handleDecision(child.id, "ACCEPTED")
                                    }
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="cursor-pointer"
                                    onClick={() =>
                                      handleDecision(child.id, "REJECTED")
                                    }
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              ) : (
                                <span className="text-sm italic text-muted-foreground">
                                  {child.status === "ACCEPTED"
                                    ? "Préinscription acceptée"
                                    : "Préinscription refusée"}
                                </span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
