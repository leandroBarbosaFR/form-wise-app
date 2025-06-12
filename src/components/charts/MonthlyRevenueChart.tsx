import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { mois: "Jan", revenus: 1200 },
  { mois: "Fév", revenus: 1400 },
  { mois: "Mar", revenus: 1600 },
  { mois: "Avr", revenus: 1500 },
  { mois: "Mai", revenus: 1800 },
];

export default function MonthlyRevenueChart() {
  return (
    <Card>
      <CardContent className="p-4">
        <h4 className="font-semibold mb-2">Revenus mensuels (€)</h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <XAxis dataKey="mois" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenus" stroke="#4f46e5" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
