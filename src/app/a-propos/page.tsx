export default function AboutPage() {
  return (
    <main className="relative max-w-3xl mx-auto p-6 pt-[150px] pb-[150px]">
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
    </main>
  );
}
