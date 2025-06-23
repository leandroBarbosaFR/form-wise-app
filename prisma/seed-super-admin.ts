// prisma/seed-super-admin.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findFirst({
    where: { role: "SUPER_ADMIN" },
  });

  if (existing) {
    console.log("✅ Super admin already exists.");
    return;
  }

  const hashedPassword = await bcrypt.hash("superadmin123", 10);

  const user = await prisma.user.create({
    data: {
      email: "admin@formwise.app",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      firstName: "Formwise",
      lastName: "Admin",
      phone: "0000000000",
    },
  });

  console.log("✅ Super admin created:", user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
