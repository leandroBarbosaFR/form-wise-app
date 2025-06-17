"use client";

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
  readByTeachers: NotificationReadTeacher[];
  isGlobal: boolean;
  teacher?: {
    user?: {
      firstName: string;
      lastName: string;
    };
  };
};

type Props = {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
};

export default function NotificationCardTeacher({
  notification,
  onMarkAsRead,
}: Props) {
  const { id, title, message, createdAt, readByTeachers } = notification;

  const isRead = readByTeachers.length > 0;

  return (
    <div
      className={`border rounded p-4 shadow-sm space-y-2 ${
        isRead ? "bg-white" : "bg-white"
      }`}
    >
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg">{title}</h3>
        <Badge
          className={
            isRead ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }
        >
          {isRead ? "Lue" : "Non lue"}
        </Badge>
      </div>

      <p className="text-sm">{message}</p>

      <p className="text-xs text-gray-500">
        {new Date(createdAt).toLocaleString()}
      </p>

      <p
        className={`text-xs font-medium px-2 py-1 inline-block rounded ${
          notification.isGlobal
            ? "bg-muted text-muted-foreground"
            : "bg-zinc-100 text-zinc-700"
        }`}
      >
        {notification.isGlobal
          ? "Notification destinée à tous les enseignants"
          : notification.teacher?.user
            ? `Notification privée pour ${notification.teacher.user.firstName}`
            : "Notification privée"}
      </p>
      {!isRead && (
        <div className="flex justify-end">
          <Button
            className="cursor-pointer"
            variant="secondary"
            onClick={() => onMarkAsRead(id)}
          >
            Marquer comme lue
          </Button>
        </div>
      )}
    </div>
  );
}
