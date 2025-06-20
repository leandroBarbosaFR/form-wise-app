"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type NotificationRead = {
  parentId: string;
  readAt?: string;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isGlobal: boolean;
  readBy: NotificationRead[];
  student?: {
    id?: string;
    firstName: string;
    lastName: string;
  } | null;
};

export default function NotificationCard({
  notifications,
  onMarkAsRead,
}: {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}) {
  if (!notifications || notifications.length === 0) {
    return (
      <p className="text-muted-foreground">Aucune notification disponible.</p>
    );
  }

  return (
    <div className="space-y-6">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto rounded-md border shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-zinc-800">
            <tr className="text-left text-gray-500 dark:text-gray-300 uppercase text-xs">
              <th className="px-4 py-3">Titre</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">À qui ?</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
            {notifications.map((notification) => {
              const { id, title, message, createdAt, isGlobal, readBy } =
                notification;
              const isRead = readBy.length > 0;

              return (
                <tr
                  key={id}
                  className="hover:bg-gray-50 dark:hover:bg-zinc-700"
                >
                  <td className="px-4 py-3 font-medium text-black dark:text-white">
                    {title}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {message}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {new Date(createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                    {isGlobal
                      ? "Tous les parents"
                      : `${notification.student?.firstName || ""} ${
                          notification.student?.lastName || ""
                        }`}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      className={
                        isRead
                          ? "bg-[#e8f7ee] text-[#2fbf6c]"
                          : "bg-[#fdecec] text-[#e3342f]"
                      }
                    >
                      {isRead ? "Lue" : "Non lue"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!isRead ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onMarkAsRead(id)}
                        className="cursor-pointer"
                      >
                        Marquer comme lue
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">
                        Déjà lue
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="block md:hidden space-y-4">
        {notifications.map((notification) => {
          const { id, title, message, createdAt, isGlobal, readBy } =
            notification;
          const isRead = readBy.length > 0;

          return (
            <div
              key={id}
              className="border p-4 rounded shadow-sm bg-white space-y-1"
            >
              <p className="font-semibold">{title}</p>
              <p className="text-sm">{message}</p>
              <p className="text-xs text-gray-500">
                {new Date(createdAt).toLocaleString()}
              </p>
              <p className="text-xs">
                {isGlobal
                  ? "Tous les parents"
                  : `${notification.student?.firstName || ""} ${
                      notification.student?.lastName || ""
                    }`}
              </p>
              <div className="text-xs">
                Statut : {isRead ? "Lue" : "Non lue"}
              </div>
              <div className="mt-2">
                {!isRead ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onMarkAsRead(id)}
                    className="cursor-pointer"
                  >
                    Marquer comme lue
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground italic">
                    Déjà lue
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
