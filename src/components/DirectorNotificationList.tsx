"use client";

import { useEffect, useState } from "react";

type Notification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isGlobal: boolean;
  teacherId?: string | null;
  student?: {
    firstName: string;
    lastName: string;
  } | null;
  teacher?: {
    user?: {
      firstName: string;
      lastName: string;
    };
  };
  readBy: { parentId: string; readAt: string | null }[];
  readByTeachers?: { teacherId: string; readAt: string | null }[];
};

export default function DirectorNotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data.notifications || []));
  }, []);

  if (notifications.length === 0) {
    return (
      <p className="text-muted-foreground mt-6">Aucune notification envoyée.</p>
    );
  }

  return (
    <div className="mt-8">
      {isMobile ? (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="rounded border p-4 shadow-sm space-y-1 bg-white"
            >
              <p className="font-semibold">{n.title}</p>
              <p className="text-sm">{n.message}</p>
              <p className="text-xs text-gray-500">
                {new Date(n.createdAt).toLocaleString()}
              </p>
              <p className="text-xs">
                {n.isGlobal
                  ? "Tous les parents"
                  : `Élève : ${n.student?.firstName} ${n.student?.lastName}`}
              </p>
              <div className="text-xs">
                {n.isGlobal ? (
                  <span className="text-gray-600">
                    {n.readBy.length} parent(s) ont lu
                  </span>
                ) : (
                  <span
                    className={`px-2 py-0.5 rounded-full font-medium ${
                      n.readBy.length > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {n.readBy.length > 0 ? "Lue" : "Non lue"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-muted text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Titre</th>
                <th className="px-4 py-3 text-left">Destinataire</th>
                <th className="px-4 py-3 text-left">Statut</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {notifications.map((n) => (
                <tr key={n.id} className="hover:bg-muted/20">
                  <td className="px-4 py-2 font-medium">{n.title}</td>
                  <td className="px-4 py-2">
                    {n.isGlobal
                      ? n.teacherId
                        ? "Tous les enseignants"
                        : "Tous les parents"
                      : n.student
                        ? `${n.student.firstName} ${n.student.lastName}`
                        : n.teacher?.user
                          ? `${n.teacher.user.firstName} ${n.teacher.user.lastName}`
                          : "Notification privée"}
                  </td>
                  <td className="px-4 py-2">
                    {n.teacherId || n.teacher ? (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          n.readByTeachers && n.readByTeachers.length > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {n.readByTeachers && n.readByTeachers.length > 0
                          ? "Lue"
                          : "Non lue"}
                      </span>
                    ) : n.isGlobal ? (
                      <span className="text-xs text-gray-600">
                        {n.readBy.length} parent(s) ont lu
                      </span>
                    ) : (
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          n.readBy.length > 0
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {n.readBy.length > 0 ? "Lue" : "Non lue"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-500">
                    {new Date(n.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
