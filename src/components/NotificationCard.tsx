"use client";

import { Button } from "@/components/ui/button";

type NotificationRead = {
  parentId: string;
  readAt?: string;
};

type Notification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isGlobal: boolean;
  readBy: NotificationRead[];
};

type Props = {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
};

export default function NotificationCard({
  notification,
  onMarkAsRead,
}: Props) {
  const { id, title, message, createdAt, isGlobal, readBy } = notification;

  const isRead = readBy.length > 0;

  return (
    <div
      className={`border rounded p-4 shadow-sm ${
        isRead ? "bg-white" : "bg-yellow-50"
      }`}
    >
      <h3 className="font-bold">{title}</h3>
      <p className="text-sm">{message}</p>
      <p className="text-xs text-gray-500 mt-1">
        {new Date(createdAt).toLocaleString()}
      </p>
      <p className="text-xs">
        {isGlobal ? "Tous les parents" : "Notification ciblée"}
      </p>

      {!isRead && (
        <Button
          className="mt-2 cursor-pointer"
          variant="secondary"
          onClick={() => onMarkAsRead(id)}
        >
          Marquer comme lue
        </Button>
      )}
      {isRead && <p className="text-green-600 text-xs mt-2">Lue</p>}
    </div>
  );
}
