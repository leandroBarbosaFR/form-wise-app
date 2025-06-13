"use client";

import TotalStudentsChart from "./charts/TotalStudentsChart";
import RibStatusChart from "./charts/RibStatusChart";
import StudentsByClassChart from "./charts/StudentsByClassChart";
import NotificationCountChart from "./charts/NotificationCountChart";

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
