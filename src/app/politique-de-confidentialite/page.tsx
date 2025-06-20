export default function PolitiqueConfidentialitePage() {
  return (
    <main className="relative max-w-3xl mx-auto p-6">
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
      <h1 className="text-2xl font-bold mb-4">Politique de Confidentialité</h1>
      <p className="mb-2">
        Nous collectons uniquement les données nécessaires à la fourniture de
        nos services (nom, email, etc.).
      </p>
      <p className="mb-2">
        Les données sont utilisées pour la gestion des comptes, les paiements
        (Stripe), la sécurité (Supabase) et la communication (Resend).
      </p>
      <p className="mb-2">
        Les données sont hébergées en France ou dans un pays conforme au RGPD,
        avec chiffrement et contrôle d’accès.
      </p>
      <p className="mb-2">
        Durée de conservation : pendant la relation contractuelle, puis
        archivage ou suppression sous 3 ans.
      </p>
      <p className="mb-2">
        Conformément au RGPD, vous pouvez exercer vos droits (accès,
        rectification, suppression) en contactant : [email RGPD].
      </p>
      <p className="mb-2">
        PRA / PCA en place pour assurer la continuité du service.
      </p>
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
    </main>
  );
}
