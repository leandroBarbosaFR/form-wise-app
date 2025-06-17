"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type NotificationReadTeacher = {
  teacherId: string;
  readAt?: string;
};

type Notification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isGlobal: boolean;
  readByTeachers: NotificationReadTeacher[];
};

export default function TeacherNotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error("Erreur récupération notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/read/teacher`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      });

      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id
            ? {
                ...notif,
                readByTeachers: [
                  ...notif.readByTeachers,
                  { teacherId: "self" },
                ],
              }
            : notif
        )
      );
    } catch (err) {
      console.error("Erreur marquage comme lu:", err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <p className="text-muted-foreground">
        Aucune notification pour l’instant.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border shadow-sm mt-6">
      <table className="min-w-full text-sm">
        <thead className="bg-muted text-muted-foreground uppercase text-xs">
          <tr>
            <th className="px-4 py-3 text-left">Titre</th>
            <th className="px-4 py-3 text-left">Message</th>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-left">Statut</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {notifications.map((notif) => {
            const isRead = notif.readByTeachers.length > 0;

            return (
              <tr key={notif.id}>
                <td className="px-4 py-2 font-medium">{notif.title}</td>
                <td className="px-4 py-2">{notif.message}</td>
                <td className="px-4 py-2">
                  {new Date(notif.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`text-xs font-medium inline-block px-2 py-1 rounded ${
                      notif.isGlobal
                        ? "bg-muted text-muted-foreground"
                        : "bg-zinc-100 text-zinc-700"
                    }`}
                  >
                    {notif.isGlobal
                      ? "Tous les enseignants"
                      : "Notification privée"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <Badge
                    className={
                      isRead
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {isRead ? "Lue" : "Non lue"}
                  </Badge>
                </td>
                <td className="px-4 py-2 text-right">
                  {isRead ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled
                      className="opacity-60 cursor-default"
                    >
                      Déjà lue
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="cursor-pointer"
                    >
                      Marquer comme lue
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
