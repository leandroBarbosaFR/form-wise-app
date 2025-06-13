"use client";

import TotalStudentsChart from "../components/charts/TotalStudentsChart";
import RibStatusChart from "../components/charts/RIBStatusChart";
import StudentsByClassChart from "../components/charts/StudentsByClassChart";
import NotificationCountChart from "../components/charts/NotificationCountChart";

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <TotalStudentsChart />
      <RibStatusChart />
      <StudentsByClassChart />
      <NotificationCountChart />
    </div>
  );
}
