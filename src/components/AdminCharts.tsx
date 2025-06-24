"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const mockData = [
  { name: "Jan", schools: 2 },
  { name: "Fév", schools: 4 },
  { name: "Mars", schools: 7 },
  { name: "Avr", schools: 5 },
  { name: "Mai", schools: 9 },
  { name: "Juin", schools: 6 },
];

export default function AdminCharts() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Écoles inscrites par mois
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mockData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="schools" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Répartition des plans</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>🟡 Essai gratuit : 12 écoles</li>
            <li>🟢 Mensuel : 8 écoles</li>
            <li>🔵 Annuel : 5 écoles</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
