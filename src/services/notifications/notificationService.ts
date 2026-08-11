import { db } from "@/lib/db";

export async function createNotification(userId: string, title: string, message: string, type: string = "INFO", link?: string) {
  return await db.notification.create({
    data: {
      userId,
      title,
      message,
      type,
      link,
    },
  });
}

export async function getUserNotifications(userId: string) {
  return await db.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export async function markNotificationAsRead(notificationId: string) {
  return await db.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
}
