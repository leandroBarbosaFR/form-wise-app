"use client";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

const COLORS = ["#22c55e", "#ef4444"];

export default function RibStatusChart() {
  const [data, setData] = useState([
    { name: "RIB à jour", value: 0 },
    { name: "RIB manquant", value: 0 },
  ]);

  useEffect(() => {
    fetch("/api/rib/status")
      .then((res) => res.json())
      .then((stats) => {
        setData([
          { name: "RIB à jour", value: stats.ribOk },
          { name: "RIB manquant", value: stats.ribMissing },
        ]);
      });
  }, []);

  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-lg font-semibold mb-4 text-center">Statut des RIB</p>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart width={300} height={200}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={60}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
