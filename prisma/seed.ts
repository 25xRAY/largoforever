import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash("ChangeMe123!", 10);

  await prisma.user.upsert({
    where: { email: "robyn.jones@pgcps.org" },
    create: {
      email: "robyn.jones@pgcps.org",
      name: "Dr. Robyn D. Jones",
      firstName: "Robyn",
      lastName: "Jones",
      role: "ADMIN",
      password: hashed,
    },
    update: {},
  });

  await prisma.user.upsert({
    where: { email: "tomeco.dates@pgcps.org" },
    create: {
      email: "tomeco.dates@pgcps.org",
      name: "Tomeco Dates",
      firstName: "Tomeco",
      lastName: "Dates",
      role: "COUNSELOR",
      password: hashed,
    },
    update: {},
  });

  await prisma.user.upsert({
    where: { email: "admin@largolions2026.org" },
    create: {
      email: "admin@largolions2026.org",
      name: "System Admin",
      firstName: "System",
      lastName: "Admin",
      role: "ADMIN",
      password: hashed,
    },
    update: {},
  });

  const studentEmails = [
    "student1@students.pgcps.org",
    "student2@students.pgcps.org",
    "student3@students.pgcps.org",
    "student4@students.pgcps.org",
    "student5@students.pgcps.org",
    "student6@students.pgcps.org",
    "student7@students.pgcps.org",
    "student8@students.pgcps.org",
    "student9@students.pgcps.org",
    "student10@students.pgcps.org",
  ];

  const firstNames = ["Jordan", "Taylor", "Morgan", "Casey", "Riley", "Avery", "Quinn", "Reese", "Skyler", "Jamie"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];

  for (let i = 0; i < 10; i++) {
    const email = studentEmails[i];
    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        name: `${firstNames[i]} ${lastNames[i]}`,
        firstName: firstNames[i],
        lastName: lastNames[i],
        role: "STUDENT",
        password: hashed,
      },
      update: {},
    });

    const creditsProgress = i < 3 ? 0.95 : i < 6 ? 0.6 : 0.35;
    const totalCredits = 21 * creditsProgress;

    await prisma.gradChecklist.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        englishCredits: Math.min(4, totalCredits * 0.2),
        mathCredits: Math.min(3, totalCredits * 0.15),
        scienceCredits: Math.min(3, totalCredits * 0.15),
        socialStudiesCredits: Math.min(3, totalCredits * 0.15),
        fineArtsCredits: Math.min(1, totalCredits * 0.05),
        peCredits: 0.5,
        healthCredits: 0.5,
        careerPathwayCredits: Math.min(6, totalCredits * 0.25),
      },
      update: {},
    });

    const gradChecklist = await prisma.gradChecklist.findUnique({ where: { userId: user.id } });
    if (gradChecklist) {
      const existing = await prisma.assessment.count({ where: { gradChecklistId: gradChecklist.id } });
      if (existing === 0) {
        await prisma.assessment.createMany({
          data: [
            { gradChecklistId: gradChecklist.id, type: "ALGEBRA_I", result: i < 4 ? "PASS" : i < 7 ? "PENDING" : "FAIL", method: "STATE", completedAt: i < 4 ? new Date() : null },
            { gradChecklistId: gradChecklist.id, type: "ENGLISH_10", result: i < 4 ? "PASS" : i < 7 ? "PENDING" : "FAIL", method: "STATE", completedAt: i < 4 ? new Date() : null },
            { gradChecklistId: gradChecklist.id, type: "GOVERNMENT", result: i < 4 ? "PASS" : i < 7 ? "PENDING" : "FAIL", method: "STATE", completedAt: i < 4 ? new Date() : null },
            { gradChecklistId: gradChecklist.id, type: "LIFE_SCIENCE", result: i < 4 ? "PASS" : i < 7 ? "PENDING" : "FAIL", method: "STATE", completedAt: i < 4 ? new Date() : null },
          ],
        });
      }
    }

    await prisma.serviceLearning.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        hours: i < 5 ? 75 : i < 8 ? 45 : 20,
        verified: i < 5,
      },
      update: {},
    });

    await prisma.localObligations.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        feesClear: i < 7,
        deviceClear: i < 8,
        booksClear: true,
        athleticClear: i > 2,
      },
      update: {},
    });

    await prisma.cCRStatus.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        pathway: "STEM",
        met: i < 6,
        completedAt: i < 6 ? new Date() : null,
      },
      update: {},
    });

    if (i < 6) {
      await prisma.win.create({
        data: {
          userId: user.id,
          type: i % 2 === 0 ? "SCHOLARSHIP" : "ACCEPTANCE",
          title: i % 2 === 0 ? "Merit Scholarship" : "College Acceptance",
          description: "Sample win",
          approved: true,
        },
      });
    }

    await prisma.yearbookPage.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        headline: `${firstNames[i]} ${lastNames[i]} · Class of 2026`,
        quote: "Legacy in Motion...Altitude Achieved!",
        status: i < 8 ? "APPROVED" : "PENDING",
        publishedAt: i < 8 ? new Date() : null,
      },
      update: {},
    });
  }

  await prisma.resource.createMany({
    data: [
      { title: "988 Suicide & Crisis Lifeline", url: "https://988lifeline.org", description: "Call or text 988", category: "crisis", sortOrder: 1 },
      { title: "Crisis Text Line", url: "https://www.crisistextline.org", description: "Text HOME to 741741", category: "crisis", sortOrder: 2 },
      { title: "PGCPS Student Resources", url: "https://www.pgcps.org", description: "District resources", category: "district", sortOrder: 3 },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
