import { Card, CardContent } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { date: "01/06", notifications: 2 },
  { date: "02/06", notifications: 4 },
  { date: "03/06", notifications: 6 },
  { date: "04/06", notifications: 3 },
  { date: "05/06", notifications: 5 },
];

export default function NotificationsSentChart() {
  return (
    <Card>
      <CardContent className="p-4">
        <h4 className="font-semibold mb-2">Notifications envoyées</h4>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="notifications"
              fill="#38bdf8"
              stroke="#0ea5e9"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
