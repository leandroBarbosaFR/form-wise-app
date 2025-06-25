"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function RefreshSessionAfterPayment() {
  const { update } = useSession();

  useEffect(() => {
    const url = new URL(window.location.href);
    const isSuccess = url.searchParams.get("success");

    if (isSuccess) {
      update(); // Rafraîchir session avec nouvelles données Stripe
    }
  }, [update]);

  return null;
}
