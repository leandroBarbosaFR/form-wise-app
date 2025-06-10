export type NotificationRead = {
  parentId: string;
  readAt?: string;
};

export type ParentNotification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isGlobal: boolean;
  student?: {
    firstName: string;
    lastName: string;
  } | null;
  readBy: NotificationRead[];
};
