import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import { redirect } from "next/navigation";
import { SubscribeButton } from "../../../components/SubscribeButton";

export default async function BillingPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Abonnement à Formwise</h1>
      <p className="mb-6">
        Profitez de toutes les fonctionnalités dès aujourd’hui.
      </p>
      <SubscribeButton />
    </div>
  );
}
