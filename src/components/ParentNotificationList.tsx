"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Notification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isGlobal: boolean;
  studentId: string | null;
  readBy: any[]; // empty if non-lue
};

export default function ParentNotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetch("/api/notifications/parent")
      .then((res) => res.json())
      .then((data) => setNotifications(data.notifications || []));
  }, []);

  const markAsRead = async (id: string) => {
    await fetch("/api/notifications/read", {
      method: "POST",
      body: JSON.stringify({ notificationId: id }),
      headers: { "Content-Type": "application/json" },
    });
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, readBy: [{ parentId: "read" }] } : n
      )
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`border rounded p-4 shadow-sm ${
            n.readBy.length > 0 ? "bg-white" : "bg-yellow-50"
          }`}
        >
          <h3 className="font-bold">{n.title}</h3>
          <p className="text-sm">{n.message}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(n.createdAt).toLocaleString()}
          </p>
          <p className="text-xs">
            📌 {n.isGlobal ? "Tous les parents" : "Notification ciblée"}
          </p>

          {n.readBy.length === 0 && (
            <Button
              className="mt-2"
              variant="secondary"
              onClick={() => markAsRead(n.id)}
            >
              Marquer comme lue
            </Button>
          )}
          {n.readBy.length > 0 && (
            <p className="text-green-600 text-xs mt-2">✅ Lue</p>
          )}
        </div>
      ))}
    </div>
  );
}
