// import { prisma } from "../src/lib/prisma";
// import bcrypt from "bcryptjs";

// async function main() {
//   const password = await bcrypt.hash("123456789", 10);

//   await prisma.user.upsert({
//     where: { email: "leobarbosacontact@gmail.com" },
//     update: {},
//     create: {
//       email: "leobarbosacontact@gmail.com",
//       password,
//       role: "DIRECTOR",
//       firstName: "Leandro",
//       lastName: "Barbosa",
//       phone: "0000000000",
//     },
//   });

//   console.log("✅ Compte directeur créé !");
// }

// main()
//   .catch(console.error)
//   .finally(() => process.exit());
import { prisma } from "../src/lib/prisma";

async function main() {
  // Créer une année scolaire
  const schoolYear = await prisma.schoolYear.create({
    data: {
      name: "2025-2026",
      startDate: new Date("2025-09-01"),
      endDate: new Date("2026-07-31"),
    },
  });

  // Créer une classe
  const class1 = await prisma.class.create({
    data: {
      name: "CM1",
      monthlyFee: 150.0,
      schoolYearId: schoolYear.id,
    },
  });

  // Créer une matière
  const subject1 = await prisma.subject.create({
    data: {
      name: "Mathématiques",
      classId: class1.id,
    },
  });

  // Créer un enseignant
  const teacher = await prisma.teacher.create({
    data: {
      firstName: "Jean",
      lastName: "Dupont",
      email: "prof@example.com",
      subjectId: subject1.id,
      classId: class1.id,
    },
  });

  console.log("Seed terminé avec l'enseignant:", teacher);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
