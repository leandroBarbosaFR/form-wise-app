export const metadata = {
  title: "Conditions Générales de Services – Formwise",
  description:
    "Consultez les conditions d’utilisation, de résiliation, et de disponibilité du service Formwise.",
};

export default function CGSPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 pt-[150px] pb-[150px]">
      <h1 className="text-2xl font-bold mb-6">
        Conditions Générales de Services (CGS)
      </h1>
      <p className="mb-4">
        Les présentes Conditions Générales de Services (CGS) régissent
        l’utilisation de la plateforme <strong>Formwise</strong> et des services
        proposés par l’éditeur à ses clients professionnels.
      </p>

      <h2 className="font-semibold mb-2">1. Durée et reconduction</h2>
      <p className="mb-4">
        Le contrat est conclu pour une durée indéterminée, avec reconduction
        automatique mensuelle ou trimestrielle selon l’offre choisie. Chaque
        période entamée est due dans son intégralité.
      </p>

      <h2 className="font-semibold mb-2">2. Résiliation</h2>
      <p className="mb-4">
        Le client peut résilier le contrat à tout moment, moyennant un préavis
        d’un (1) mois avant la date de reconduction. La résiliation n’ouvre
        droit à aucun remboursement proratisé sauf disposition contractuelle
        contraire.
      </p>

      <h2 className="font-semibold mb-2">3. Disponibilité du service (SLA)</h2>
      <p className="mb-4">
        L’éditeur s’engage à assurer une disponibilité mensuelle moyenne de{" "}
        <strong>95%</strong>, hors opérations de maintenance planifiée ou cas de
        force majeure. En cas de manquement significatif, un avoir commercial
        pourra être envisagé à titre de geste commercial, sans que cela
        constitue une reconnaissance de responsabilité.
      </p>

      <h2 className="font-semibold mb-2">4. Limitation de responsabilité</h2>
      <p className="mb-4">
        La responsabilité de l’éditeur est limitée, toutes causes confondues, à
        un montant équivalent aux sommes versées par le client au titre des
        douze (12) derniers mois. Aucune indemnisation ne sera due pour les
        dommages indirects, pertes de données ou de chiffre d’affaires.
      </p>

      <h2 className="font-semibold mb-2">5. Propriété et droit d’usage</h2>
      <p className="mb-4">
        Le client bénéficie uniquement d’un droit personnel, non exclusif et non
        transférable d’utilisation des services. Aucun droit de propriété
        intellectuelle ne lui est cédé. Toute reproduction ou tentative
        d’ingénierie inverse est strictement interdite.
      </p>

      <h2 className="font-semibold mb-2">6. Réversibilité des données</h2>
      <p className="mb-4">
        Le client peut demander l’export de ses données à l’issue du contrat.
        Cette opération peut faire l’objet d’une facturation spécifique selon sa
        complexité. Les données sont restituées dans un format standard (CSV,
        JSON, etc.).
      </p>

      <h2 className="font-semibold mb-2">7. Loi applicable et juridiction</h2>
      <p className="mb-4">
        Le présent contrat est régi par le droit français. En cas de litige, les
        tribunaux compétents seront ceux du ressort de{" "}
        <strong>Marseille</strong>.
      </p>
    </main>
  );
}
