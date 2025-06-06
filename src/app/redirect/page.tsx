"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // wait for loading section
    // will check the section, will find the user and then the role to be able to redirect to the right path /
    const role = session?.user?.role;
    // if the role is not valid then redirect to the login page
    if (!role) {
      router.push("/login");
      return;
    }

    switch (role) {
      case "PARENT":
        router.push("/dashboard/parent");
        break;
      case "TEACHER":
        router.push("/dashboard/teacher");
        break;
      case "DIRECTOR":
        router.push("/dashboard/director");
        break;
      default:
        router.push("/");
    }
  }, [session, status, router]);

  return <p>Redirection en cours...</p>;
}
