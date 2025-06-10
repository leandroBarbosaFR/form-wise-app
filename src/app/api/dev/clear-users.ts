import { prisma } from "../../../lib/prisma";

export async function GET() {
  await prisma.notificationRead.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.user.deleteMany({});

  return Response.json({ success: true });
}
