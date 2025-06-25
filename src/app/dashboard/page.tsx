import { Suspense } from "react";
import DashboardSuccessDialog from "../../components/DashboardSuccessDialog";

export default function DashboardPage() {
  return (
    <>
      <Suspense fallback={null}>
        <DashboardSuccessDialog />
      </Suspense>

      <div className="p-6">
        {/* Le contenu réel de ton dashboard ici */}
        <h1>Bienvenue sur le Dashboard</h1>
      </div>
    </>
  );
}
