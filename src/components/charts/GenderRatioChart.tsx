import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Filles", value: 45 },
  { name: "Garçons", value: 55 },
];

const COLORS = ["#c084fc", "#60a5fa"];

export default function GenderRatioChart() {
  return (
    <Card>
      <CardContent className="p-4">
        <h4 className="font-semibold mb-2">Répartition filles / garçons</h4>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={60}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
