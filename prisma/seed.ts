import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const email = "leobarbosacontact@gmail.com";
  const plainPassword = "Formwise13011";

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Le directeur existe déjà.");
    return;
  }

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: "DIRECTOR",
    },
  });

  console.log("Directeur créé avec succès !");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
