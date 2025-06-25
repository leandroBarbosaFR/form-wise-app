"use client";

import { usePathname } from "next/navigation";
import MinimalFooter from "./MinimalFooter";

export default function ConditionalFooterPublic() {
  const pathname = usePathname();

  const isMinimalPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/register/free-trial";

  return isMinimalPage ? <MinimalFooter /> : null;
}
