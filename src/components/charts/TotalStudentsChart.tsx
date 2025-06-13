"use client";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

export default function TotalStudentsChart() {
  const [data, setData] = useState();

  useEffect(() => {
    fetch("/api/students/count-by-year")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-lg font-semibold mb-4 text-center">
          Évolution des élèves
        </p>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="élèves"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
