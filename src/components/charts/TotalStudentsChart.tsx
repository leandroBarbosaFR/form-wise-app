import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", élèves: 30 },
  { name: "Fév", élèves: 45 },
  { name: "Mar", élèves: 60 },
  { name: "Avr", élèves: 55 },
  { name: "Mai", élèves: 70 },
];

export default function TotalStudentsChart() {
  return (
    <Card>
      <CardContent className="p-4">
        <h4 className="font-semibold mb-2">Évolution des élèves inscrits</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="élèves" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
