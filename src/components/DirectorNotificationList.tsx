"use client";

import { useEffect, useState } from "react";

type Notification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isGlobal: boolean;
  student?: {
    firstName: string;
    lastName: string;
  } | null;
  readBy: { parentId: string; readAt: string | null }[];
};

export default function DirectorNotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data.notifications || []));
  }, []);

  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-xl font-semibold">Historique des notifications</h2>
      {notifications.length === 0 ? (
        <p>Aucune notification envoyée.</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n.id}
            className="border rounded p-4 bg-white shadow-sm space-y-1"
          >
            <h3 className="font-bold">{n.title}</h3>
            <p className="text-sm">{n.message}</p>
            <p className="text-xs text-gray-500">
              {new Date(n.createdAt).toLocaleString()}
            </p>
            <p className="text-xs">
              {" "}
              {n.isGlobal
                ? "Tous les parents"
                : `Élève : ${n.student?.firstName} ${n.student?.lastName}`}
            </p>
            {n.isGlobal ? (
              <p className="text-xs text-gray-600">
                {n.readBy.length} parent(s) ont lu cette notification
              </p>
            ) : (
              <div className="text-xs flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full font-medium ${
                    n.readBy.length > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {n.readBy.length > 0 ? "Lue" : "Non lue"}
                </span>
                par le parent de {n.student?.firstName} {n.student?.lastName}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
