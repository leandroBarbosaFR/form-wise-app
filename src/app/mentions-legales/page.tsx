export const metadata = {
  title: "Mentions Légales – Formwise",
  description:
    "Informations légales sur l’éditeur du site Formwise, l’hébergeur, et la propriété intellectuelle.",
};

export default function MentionsLegalesPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 pt-[150px] pb-[150px]">
      {/* Background flou en haut */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem]
            -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr
            from-[#ff80b5] to-[#9089fc] opacity-30
            sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
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
      {/* Background flou en haut */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] 
              -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 
              sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </main>
  );
}
