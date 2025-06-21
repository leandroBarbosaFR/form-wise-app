export const metadata = {
  title: "Politique de Confidentialité – Formwise",
  description:
    "Découvrez comment Formwise protège vos données conformément au RGPD et à la loi française.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <main className="relative max-w-3xl mx-auto p-6 pt-[150px] pb-[150px]">
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

      {/* Contenu */}
      <h1 className="text-2xl font-bold mb-6">Politique de Confidentialité</h1>

      <p className="mb-4">
        La présente politique de confidentialité décrit comment la plateforme{" "}
        <strong>Formwise</strong> collecte, utilise, conserve et protège les
        données personnelles de ses utilisateurs, conformément au Règlement
        Général sur la Protection des Données (RGPD) et à la loi française
        applicable.
      </p>

      <h2 className="font-semibold mb-2">1. Responsable du traitement</h2>
      <p className="mb-4">
        Le responsable du traitement des données est <strong>Formwise</strong>,
        situé à <strong>11 Rue Étienne Henry Gouin 13011 à Marseille</strong>,
        joignable à l’adresse : <strong>formwisecontact@gmail.com</strong>.
      </p>

      <h2 className="font-semibold mb-2">2. Données collectées</h2>
      <div className="mb-4">
        <p>
          Nous collectons uniquement les données strictement nécessaires à la
          fourniture de nos services :
        </p>
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>Nom et prénom</li>
          <li>Adresse e-mail</li>
          <li>Mot de passe (crypté)</li>
          <li>Données liées à l’établissement scolaire</li>
          <li>Informations bancaires (via Stripe)</li>
          <li>Données de connexion et d’usage</li>
        </ul>
      </div>

      <h2 className="font-semibold mb-2">3. Finalités du traitement</h2>
      <div className="mb-4">
        <p>Les données sont utilisées pour :</p>
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>la création et la gestion des comptes utilisateurs</li>
          <li>le traitement des paiements (Stripe)</li>
          <li>la sécurisation des accès et des contenus (Supabase)</li>
          <li>l’envoi d’e-mails transactionnels (Resend)</li>
          <li>l’amélioration continue de nos services</li>
        </ul>
      </div>

      <h2 className="font-semibold mb-2">4. Hébergement</h2>
      <p className="mb-4">
        Les données sont hébergées en France ou dans des pays reconnus comme
        adéquats par la Commission européenne. Toutes les données sont
        sécurisées par chiffrement, contrôle d’accès, et sauvegardes régulières.
      </p>

      <h2 className="font-semibold mb-2">5. Durée de conservation</h2>
      <p className="mb-4">
        Les données sont conservées pendant toute la durée de la relation
        contractuelle, puis archivées sous une forme pseudonymisée (sans nom ni
        prénom) pendant un maximum de 3 ans à des fins de preuve ou de respect
        d&apos;obligations légales, avant suppression définitive.
      </p>

      <h2 className="font-semibold mb-2">6. Vos droits</h2>
      <div className="mb-4">
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>Droit d’accès à vos données</li>
          <li>Droit de rectification ou d’effacement</li>
          <li>Droit à la limitation du traitement</li>
          <li>Droit à la portabilité</li>
          <li>Droit d’opposition</li>
        </ul>
        <p className="mt-4">
          Vous pouvez exercer vos droits en nous contactant à l’adresse suivante
          : <strong>formwisecontact@gmail.com</strong>. Nous nous engageons à
          répondre dans un délai de 30 jours.
        </p>
      </div>

      <h2 className="font-semibold mb-2">7. Sécurité</h2>
      <p className="mb-4">
        Des mesures techniques et organisationnelles sont mises en place pour
        protéger vos données, notamment le chiffrement, la double
        authentification, les sauvegardes régulières, et un contrôle strict des
        accès.
      </p>

      <h2 className="font-semibold mb-2">8. Sous-traitants</h2>
      <div className="mb-4">
        <p>Nous faisons appel à des sous-traitants respectueux du RGPD :</p>
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>
            <strong>Stripe</strong> pour les paiements
          </li>
          <li>
            <strong>Supabase</strong> pour l’hébergement des données
          </li>
          <li>
            <strong>Resend</strong> pour les emails transactionnels
          </li>
        </ul>
        <p className="mt-4">
          Chacun de ces services est conforme aux exigences du RGPD.
        </p>
      </div>

      <h2 className="font-semibold mb-2">9. Continuité de service</h2>
      <p className="mb-4">
        Des dispositifs de Plan de Reprise d’Activité (PRA) et de Plan de
        Continuité d’Activité (PCA) sont mis en œuvre pour garantir la
        disponibilité et l’intégrité du service.
      </p>

      <h2 className="font-semibold mb-2">10. Modifications</h2>
      <p className="mb-4">
        Nous nous réservons le droit de modifier cette politique à tout moment.
        En cas de modification substantielle, vous serez notifié par email ou
        lors de votre prochaine connexion à la plateforme.
      </p>

      <h2 className="font-semibold mb-2">11. Droit applicable</h2>
      <p className="mb-4">
        Cette politique est régie par le droit français. En cas de litige, les
        tribunaux de <strong>Marseille</strong> seront seuls compétents.
      </p>

      {/* Background flou en bas */}
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
