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
  { classe: "CP", élèves: 25 },
  { classe: "CE1", élèves: 20 },
  { classe: "CE2", élèves: 30 },
  { classe: "CM1", élèves: 15 },
  { classe: "CM2", élèves: 10 },
];

export default function ClassesDistributionChart() {
  return (
    <Card>
      <CardContent className="p-4">
        <h4 className="font-semibold mb-2">
          Répartition des élèves par classe
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <XAxis dataKey="classe" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="élèves" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
