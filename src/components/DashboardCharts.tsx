"use client";

import TotalStudentsChart from "./charts/TotalStudentsChart";
import RIBStatusChart from "./charts/RIBStatusChart";
import ClassesDistributionChart from "./charts/ClassesDistributionChart";
import MonthlyRevenueChart from "./charts/MonthlyRevenueChart";
import NotificationsSentChart from "./charts/NotificationsSentChart";
import GenderRatioChart from "./charts/GenderRatioChart";

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <TotalStudentsChart />
      <RIBStatusChart />
      <ClassesDistributionChart />
      <MonthlyRevenueChart />
      <NotificationsSentChart />
      <GenderRatioChart />
    </div>
  );
}
