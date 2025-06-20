export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">À propos</h1>

      <p className="mb-4">
        Bienvenue sur <strong>[Nom de ton SaaS]</strong>, une plateforme conçue
        pour simplifier la gestion des inscriptions, des paiements et de la
        communication au sein des établissements scolaires.
      </p>

      <p className="mb-4">
        Notre objectif est de proposer une solution tout-en-un, sécurisée,
        intuitive et conforme aux normes RGPD, qui facilite la vie des
        directeurs, professeurs et parents.
      </p>

      <p className="mb-4">
        Ce projet est né d’un constat simple : trop d’écoles utilisent encore
        des outils dispersés comme Excel, Google Forms ou WhatsApp pour gérer
        des processus critiques.
      </p>

      <p className="mb-4">
        Avec <strong>[Nom de ton SaaS]</strong>, nous voulons offrir une
        alternative moderne, développée en France 🇫🇷, hébergée en Europe, et
        pensée pour les vraies contraintes du terrain.
      </p>

      <p className="text-sm text-gray-500 mt-8">
        Pour toute question, n’hésitez pas à nous contacter à :{" "}
        <a href="mailto:contact@tonsaas.com" className="underline">
          contact@tonsaas.com
        </a>
      </p>
    </main>
  );
}
