"use client";

import { Dispatch, SetStateAction } from "react";
import { DashboardSection } from "../types/types";

export default function SidebarBtn({
  label,
  section,
  activeSection,
  setActiveSection,
}: {
  label: string;
  section: DashboardSection;
  activeSection: DashboardSection;
  setActiveSection: Dispatch<SetStateAction<DashboardSection>>;
}) {
  return (
    <button
      onClick={() => setActiveSection(section)}
      className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-200 cursor-pointer ${
        activeSection === section ? "bg-gray-300 font-bold" : ""
      }`}
    >
      {label}
    </button>
  );
}
