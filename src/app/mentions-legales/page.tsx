export const metadata = {
  title: "Mentions Légales – Formwise",
  description:
    "Informations légales sur l’éditeur du site Formwise, l’hébergeur, et la propriété intellectuelle.",
};

export default function MentionsLegalesPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 pt-[150px] pb-[150px]">
      <h1 className="text-2xl font-bold mb-6">Mentions légales</h1>

      <h2 className="font-semibold mb-2">Éditeur du site</h2>
      <p className="mb-4">
        <strong>Formwise</strong>, édité par Leandro Barbosa Lemos
        <br />
        Micro-entrepreneur enregistré en France
      </p>

      <h2 className="font-semibold mb-2">Adresse</h2>
      <p className="mb-4">
        11 Rue Étienne Henry Gouin, 13011 Marseille, France
      </p>

      <h2 className="font-semibold mb-2">Responsable de la publication</h2>
      <p className="mb-4">Leandro Barbosa Lemos, Fondateur</p>

      <h2 className="font-semibold mb-2">Informations légales</h2>
      <p className="mb-4">
        SIRET : 912 345 678 00019
        <br />
        TVA intracommunautaire : FRXX123456789
      </p>

      <h2 className="font-semibold mb-2">Hébergeur</h2>
      <p className="mb-4">
        Vercel Inc.
        <br />
        440 N Barranca Ave #4133, Covina, CA 91723, USA
        <br />
        Site :{" "}
        <a href="https://vercel.com" className="underline">
          vercel.com
        </a>
      </p>

      <h2 className="font-semibold mb-2">Propriété intellectuelle</h2>
      <p className="mb-4">
        Toute reproduction, extraction ou réutilisation du contenu du site est
        strictement interdite sans autorisation écrite préalable de l’éditeur.
        Le non-respect de cette interdiction peut engager la responsabilité
        civile et pénale du contrevenant.
      </p>
    </main>
  );
}
