export const metadata = {
  title: "Conditions Générales d’Utilisation – Formwise",
  description:
    "Lisez les conditions d’utilisation de la plateforme Formwise, incluant les obligations, les restrictions et les responsabilités des utilisateurs.",
};

export default function CGUPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 pt-[150px] pb-[150px]">
      <h1 className="text-2xl font-bold mb-6">
        Conditions Générales d’Utilisation (CGU)
      </h1>

      <h2 className="font-semibold mb-2">1. Objet</h2>
      <p className="mb-4">
        Les présentes Conditions Générales d’Utilisation ont pour objet de
        définir les modalités et conditions d’accès et d’utilisation des
        services proposés par Formwise (ci-après « la Plateforme »), éditée par
        1367 Studio, dont le siège social est situé à 11 Rue Étienne Henry
        Gouin, 13011 Marseille, immatriculée sous le numéro 912 767 845 00015.
      </p>

      <h2 className="font-semibold mb-2">2. Acceptation</h2>
      <p className="mb-4">
        L’utilisation de la Plateforme implique l’acceptation pleine et entière
        des présentes conditions par l’utilisateur. En cas de désaccord avec
        tout ou partie des CGU, l’utilisateur doit cesser immédiatement
        l’utilisation des services.
      </p>

      <h2 className="font-semibold mb-2">3. Accès aux services</h2>
      <p className="mb-4">
        L’accès à la Plateforme est réservé aux utilisateurs disposant d’un
        compte personnel, créé via le formulaire d’inscription. L’utilisateur
        s’engage à fournir des informations exactes lors de la création de son
        compte et à les tenir à jour. L’accès peut être suspendu temporairement
        pour des raisons techniques (maintenance, mises à jour, sécurité…).
      </p>

      <h2 className="font-semibold mb-2">4. Obligations de l’utilisateur</h2>
      <p className="mb-4">
        L’utilisateur s’engage à :
        <br />– utiliser la Plateforme de manière légale, loyale et non
        frauduleuse ;
        <br />– ne pas tenter d’accéder à des données ou fonctionnalités non
        autorisées ;
        <br />– ne pas perturber ou interrompre le bon fonctionnement des
        services ;
        <br />– respecter les droits des autres utilisateurs et les lois en
        vigueur.
        <br />
        Toute violation peut entraîner la suspension ou la suppression immédiate
        du compte, sans préavis ni indemnité.
      </p>

      <h2 className="font-semibold mb-2">5. Propriété intellectuelle</h2>
      <p className="mb-4">
        Tous les contenus présents sur la Plateforme (textes, logos, graphismes,
        vidéos, logiciels, etc.) sont la propriété exclusive de Formwise ou font
        l’objet d’un droit d’usage. Toute reproduction, représentation,
        diffusion ou exploitation, totale ou partielle, sans autorisation
        préalable est strictement interdite.
      </p>

      <h2 className="font-semibold mb-2">6. Données personnelles</h2>
      <p className="mb-4">
        Les données collectées via la Plateforme sont traitées conformément à
        notre Politique de confidentialité. Conformément au RGPD, l’utilisateur
        dispose d’un droit d’accès, de rectification, d’opposition et de
        suppression de ses données en contactant :{" "}
        <strong>formwisecontact@gmail.com</strong>.
      </p>

      <h2 className="font-semibold mb-2">7. Responsabilité</h2>
      <p className="mb-4">
        La Plateforme est fournie « en l’état ». Formwise ne saurait être tenue
        responsable des dommages directs ou indirects résultant de l’utilisation
        ou de l’impossibilité d’utiliser les services.
      </p>

      <h2 className="font-semibold mb-2">8. Résiliation</h2>
      <p className="mb-4">
        L’utilisateur peut à tout moment supprimer son compte. L’éditeur se
        réserve le droit de suspendre ou résilier tout compte en cas de
        non-respect des présentes conditions, sans préavis.
      </p>

      <h2 className="font-semibold mb-2">9. Modifications des CGU</h2>
      <p className="mb-4">
        Formwise se réserve le droit de modifier les présentes CGU à tout
        moment. L’utilisateur sera informé de toute mise à jour via la
        Plateforme. L’utilisation continue après modification vaut acceptation.
      </p>

      <h2 className="font-semibold mb-2">
        10. Droit applicable et juridiction compétente
      </h2>
      <p className="mb-2">
        Les présentes CGU sont régies par le droit français. En cas de litige,
        compétence exclusive est attribuée aux tribunaux de{" "}
        <strong>Marseille</strong>, sauf disposition légale contraire.
      </p>
      <p className="mb-4">
        La responsabilité de la Plateforme ne pourra en aucun cas excéder un
        montant équivalent à deux (2) mois de frais effectivement payés par
        l’utilisateur pour l’utilisation des services au cours des douze (12)
        derniers mois précédant le fait générateur du litige.
      </p>
    </main>
  );
}
