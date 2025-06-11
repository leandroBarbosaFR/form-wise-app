"use client";

import { Dispatch, SetStateAction } from "react";
import { DashboardSection } from "../types/types";

export default function SidebarBtn({
  label,
  section,
  activeSection,
  setActiveSection,
  hasNotification,
}: {
  label: string;
  section: DashboardSection;
  activeSection: DashboardSection;
  setActiveSection: Dispatch<SetStateAction<DashboardSection>>;
  hasNotification?: boolean;
}) {
  return (
    <button
      onClick={() => setActiveSection(section)}
      className={`flex items-center justify-between w-full text-left px-3 py-2 rounded hover:bg-gray-200 cursor-pointer ${
        activeSection === section ? "bg-gray-300 font-bold" : ""
      }`}
    >
      <span>{label}</span>

      {hasNotification && (
        <span className="relative flex h-2 w-2 ml-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
        </span>
      )}
    </button>
  );
}
