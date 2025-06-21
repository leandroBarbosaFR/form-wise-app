export default function AboutPage() {
  return (
    <main className="relative max-w-3xl mx-auto p-6 pt-[150px] pb-[150px]">
      {/* Background visuel haut */}

      {/* Backgrounds */}
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

      <h1 className="text-3xl font-bold mb-6">À propos de Formwise</h1>

      <p className="mb-4">
        <strong>Formwise</strong> est une plateforme SaaS dédiée à la gestion
        moderne des établissements scolaires : inscriptions, paiements,
        documents, notifications, et bien plus encore, tout-en-un.
      </p>

      <h2 className="font-semibold text-xl mt-8 mb-2">Notre mission</h2>
      <p className="mb-4">
        Nous avons créé Formwise pour aider les écoles, les crèches et les
        structures éducatives à abandonner les feuilles Excel, les groupes
        WhatsApp et les multiples outils dispersés. Notre mission est de rendre
        la gestion scolaire plus fluide, plus professionnelle et surtout plus
        humaine.
      </p>

      <h2 className="font-semibold text-xl mt-8 mb-2">
        Une technologie moderne
      </h2>
      <p className="mb-4">
        Formwise est développé avec les meilleures technologies web : Next.js,
        Supabase, Stripe, et ShadCN UI. L&apos;application est hébergée en
        Europe (OVH/Supabase), et respecte scrupuleusement les normes RGPD pour
        garantir la confidentialité et la sécurité des données.
      </p>

      <h2 className="font-semibold text-xl mt-8 mb-2">Pensé pour le terrain</h2>
      <p className="mb-4">
        Nous collaborons directement avec des directeurs, professeurs et parents
        pour construire une solution utile, intuitive et adaptée aux réalités de
        chaque établissement. Chaque fonctionnalité naît d’un besoin réel.
      </p>

      <h2 className="font-semibold text-xl mt-8 mb-2">
        🇫🇷 Une solution française
      </h2>
      <p className="mb-4">
        Formwise est une solution 100% française, développée à Marseille par
        l&apos;agence 1367 Studio. Elle vise à offrir une alternative locale et
        fiable aux solutions américaines ou inadaptées au système éducatif
        francophone.
      </p>

      <h2 className="font-semibold text-xl mt-8 mb-2">Sécurité & conformité</h2>
      <p className="mb-4">
        Toutes les données sont chiffrées, sauvegardées régulièrement, et les
        accès sont sécurisés par authentification renforcée. Nos serveurs sont
        basés en Europe et conformes aux recommandations CNIL.
      </p>

      <p className="text-sm text-gray-500 mt-12">
        Pour toute question, partenariat ou retour utilisateur, vous pouvez nous
        écrire à :{" "}
        <a href="mailto:formwisecontact@gmail.com" className="underline">
          formwisecontact@gmail.com
        </a>
      </p>

      {/* Second background */}
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
