// import React from "react";

// interface Props {
//   decision: "ACCEPTED" | "REJECTED";
//   childName: string;
//   parentName: string;
// }

// // Export par défaut
// const ValidateEmailTemplate: React.FC<Props> = ({
//   decision,
//   childName,
//   parentName,
// }) => {
//   return (
//     <div>
//       <p>Bonjour {parentName},</p>
//       <p>
//         La préinscription de {childName} a été{" "}
//         <strong>{decision === "ACCEPTED" ? "acceptée" : "refusée"}</strong>.
//       </p>
//       <p>
//         {decision === "ACCEPTED"
//           ? "Vous recevrez bientôt plus d'informations concernant la suite de l'inscription."
//           : "N'hésitez pas à nous contacter pour plus de détails."}
//       </p>
//     </div>
//   );
// };

// export default ValidateEmailTemplate;

import React from "react";

interface Props {
  decision: "ACCEPTED" | "REJECTED";
  childName: string;
  parentName: string;
  schoolCode: string;
  registrationLink: string;
}

const ValidateEmailTemplate: React.FC<Props> = ({
  decision,
  childName,
  parentName,
  schoolCode,
  registrationLink,
}) => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        lineHeight: "1.6",
      }}
    >
      <p>Bonjour {parentName},</p>

      <p>
        La préinscription de <strong>{childName}</strong> a été{" "}
        <strong>{decision === "ACCEPTED" ? "acceptée" : "refusée"}</strong>.
      </p>

      {decision === "ACCEPTED" ? (
        <>
          <p>
            🎉 Bienvenue dans notre établissement ! Nous sommes ravis de vous
            compter parmi nous.
          </p>
          <p>👉 Voici la prochaine étape à suivre :</p>
          <p>
            Veuillez finaliser votre inscription en cliquant sur le lien
            ci-dessous :
          </p>
          <p>
            <a
              href={registrationLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {registrationLink}
            </a>
          </p>
          <p>
            Lors de l&apos;inscription, utilisez le code de l&apos;école suivant
            : <strong>{schoolCode}</strong>
          </p>
          <p>
            Une fois inscrit, vous aurez accès à votre tableau de bord pour
            suivre l’évolution de votre dossier.
          </p>
          <p>À très bientôt !</p>
        </>
      ) : (
        <p>
          N&apos;hésitez pas à nous contacter si vous souhaitez plus
          d&apos;informations ou pour toute question.
        </p>
      )}
    </div>
  );
};

export default ValidateEmailTemplate;
