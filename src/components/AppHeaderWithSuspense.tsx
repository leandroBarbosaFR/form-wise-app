"use client";

import { Suspense } from "react";
import AppHeader from "./AppHeader";

export default function AppHeaderWithSuspense() {
  return (
    <Suspense fallback={null}>
      <AppHeader />
    </Suspense>
  );
}
