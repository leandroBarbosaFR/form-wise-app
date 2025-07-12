"use client";

import { useSearchParams } from "next/navigation";
import PreRegistrationForm from "./PreRegistrationForm";

export default function ClientWrapper() {
  const searchParams = useSearchParams();
  const schoolCode = searchParams?.get("schoolCode") || "";

  return <PreRegistrationForm schoolCode={schoolCode} />;
}
