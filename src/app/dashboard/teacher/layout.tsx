import AppHeader from "components/AppHeader";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <AppHeader />
      <main>{children}</main>
    </div>
  );
}
