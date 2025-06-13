"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

// Palette de couleurs réutilisables
function getRandomColor(index: number) {
  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#6366f1",
    "#e11d48",
    "#14b8a6",
    "#a855f7",
    "#f97316",
    "#22d3ee",
    "#84cc16",
    "#f43f5e",
    "#0ea5e9",
    "#8b5cf6",
    "#d946ef",
  ];
  return colors[index % colors.length];
}

export default function StudentsByClassChart() {
  const [data, setData] = useState<{ class: string; élèves: number }[]>([]);

  useEffect(() => {
    fetch("/api/students/by-class")
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-lg font-semibold mb-4 text-center">
          Élèves par classe
        </p>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart width={350} height={250} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="class" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="élèves">
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={getRandomColor(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
