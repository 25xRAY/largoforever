import {
  PrismaClient,
  HonorDesignation,
  DistrictLeaderboardCategory,
  type UserRole,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function ensureResource(data: {
  title: string;
  url: string;
  description: string | null;
  category: string;
  sortOrder: number;
}) {
  const exists = await prisma.resource.findFirst({
    where: { title: data.title, category: data.category },
  });
  if (!exists) {
    await prisma.resource.create({ data });
  }
}

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

  const teacherUser = await prisma.user.upsert({
    where: { email: "coach.teacher@pgcps.org" },
    create: {
      email: "coach.teacher@pgcps.org",
      name: "Alex Mentor",
      firstName: "Alex",
      lastName: "Mentor",
      role: "TEACHER",
      password: hashed,
      profileComplete: true,
      teacherDepartment: "MATH",
      teacherSubject: "Algebra II — Room 214",
    },
    update: {
      role: "TEACHER",
      teacherDepartment: "MATH",
      teacherSubject: "Algebra II — Room 214",
      profileComplete: true,
    },
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

  const firstNames = [
    "Jordan",
    "Taylor",
    "Morgan",
    "Casey",
    "Riley",
    "Avery",
    "Quinn",
    "Reese",
    "Skyler",
    "Jamie",
  ];
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
  ];

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

    await prisma.user.update({
      where: { id: user.id },
      data: {
        displayGpa: Math.round((3.08 + i * 0.1) * 100) / 100,
        apIbCourseCount: Math.min(10, i + 2),
        honorDesignation:
          i === 0
            ? HonorDesignation.VALEDICTORIAN
            : i === 1
              ? HonorDesignation.SALUTATORIAN
              : HonorDesignation.NONE,
        leadershipRolesJson:
          i >= 6
            ? JSON.stringify([
                { position: "Senior Class Representative", organization: "SGA" },
                { position: "Key Club Officer", organization: "Key Club" },
              ])
            : i >= 3
              ? JSON.stringify([{ position: "NHS Member", organization: "National Honor Society" }])
              : null,
      },
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
      const existing = await prisma.assessment.count({
        where: { gradChecklistId: gradChecklist.id },
      });
      if (existing === 0) {
        await prisma.assessment.createMany({
          data: [
            {
              gradChecklistId: gradChecklist.id,
              type: "ALGEBRA_I",
              result: i < 4 ? "PASS" : i < 7 ? "PENDING" : "FAIL",
              method: "STATE",
              completedAt: i < 4 ? new Date() : null,
            },
            {
              gradChecklistId: gradChecklist.id,
              type: "ENGLISH_10",
              result: i < 4 ? "PASS" : i < 7 ? "PENDING" : "FAIL",
              method: "STATE",
              completedAt: i < 4 ? new Date() : null,
            },
            {
              gradChecklistId: gradChecklist.id,
              type: "GOVERNMENT",
              result: i < 4 ? "PASS" : i < 7 ? "PENDING" : "FAIL",
              method: "STATE",
              completedAt: i < 4 ? new Date() : null,
            },
            {
              gradChecklistId: gradChecklist.id,
              type: "LIFE_SCIENCE",
              result: i < 4 ? "PASS" : i < 7 ? "PENDING" : "FAIL",
              method: "STATE",
              completedAt: i < 4 ? new Date() : null,
            },
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

    const yearbookSlug = `${firstNames[i]}-${lastNames[i]}-${i + 1}`
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    await prisma.yearbookPage.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        slug: yearbookSlug.slice(0, 120),
        headline: `${firstNames[i]} ${lastNames[i]} · Class of 2026`,
        quote: "Legacy in Motion...Altitude Achieved!",
        status: i < 8 ? "APPROVED" : "PENDING",
        publishedAt: i < 8 ? new Date() : null,
      },
      update: {},
    });
  }

  const firstStudentForLink = await prisma.user.findFirst({
    where: { email: studentEmails[0] },
  });
  if (firstStudentForLink) {
    await prisma.teacherStudent.upsert({
      where: {
        teacherId_studentId: {
          teacherId: teacherUser.id,
          studentId: firstStudentForLink.id,
        },
      },
      create: {
        teacherId: teacherUser.id,
        studentId: firstStudentForLink.id,
      },
      update: {},
    });
  }

  const rosterRows: {
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    used: boolean;
  }[] = [
    {
      email: "robyn.jones@pgcps.org",
      firstName: "Robyn",
      lastName: "Jones",
      role: "ADMIN",
      used: true,
    },
    {
      email: "tomeco.dates@pgcps.org",
      firstName: "Tomeco",
      lastName: "Dates",
      role: "COUNSELOR",
      used: true,
    },
    {
      email: "admin@largolions2026.org",
      firstName: "System",
      lastName: "Admin",
      role: "ADMIN",
      used: true,
    },
    {
      email: "coach.teacher@pgcps.org",
      firstName: "Alex",
      lastName: "Mentor",
      role: "TEACHER",
      used: true,
    },
    ...studentEmails.map((email, i) => ({
      email,
      firstName: firstNames[i],
      lastName: lastNames[i],
      role: "STUDENT" as UserRole,
      used: true,
    })),
  ];

  for (const row of rosterRows) {
    await prisma.approvedRoster.upsert({
      where: { email: row.email },
      create: row,
      update: {
        firstName: row.firstName,
        lastName: row.lastName,
        role: row.role,
        used: row.used,
      },
    });
  }

  const resourceSeeds: Parameters<typeof ensureResource>[0][] = [
    {
      title: "988 Suicide & Crisis Lifeline",
      url: "https://988lifeline.org",
      description: "Call or text 988",
      category: "crisis",
      sortOrder: 1,
    },
    {
      title: "Crisis Text Line",
      url: "https://www.crisistextline.org",
      description: "Text HOME to 741741",
      category: "crisis",
      sortOrder: 2,
    },
    {
      title: "PGCPS Student Resources",
      url: "https://www.pgcps.org",
      description: "District overview and family resources",
      category: "district",
      sortOrder: 1,
    },
    {
      title: "Maryland High School Graduation Requirements",
      url: "https://www.mdgradrequirements.org",
      description: "State summary of diploma requirements",
      category: "graduation",
      sortOrder: 1,
    },
    {
      title: "Largo HS counseling — graduation checklist",
      url: "https://www.pgcps.org/",
      description: "Meet with counseling for your personal credit plan",
      category: "graduation",
      sortOrder: 2,
    },
    {
      title: "FAFSA® Application",
      url: "https://studentaid.gov/h/apply-for-aid/fafsa",
      description: "Free Application for Federal Student Aid",
      category: "fa",
      sortOrder: 1,
    },
    {
      title: "Maryland State Financial Aid (MHEC)",
      url: "https://mhec.maryland.gov",
      description: "State grants and scholarships",
      category: "fa",
      sortOrder: 2,
    },
    {
      title: "MCAP / assessment information",
      url: "https://www.mdgradrequirements.org",
      description: "Maryland comprehensive assessments for graduation",
      category: "graduation",
      sortOrder: 3,
    },
    {
      title: "Naviance / college applications",
      url: "https://www.naviance.com",
      description: "College and career planning (if enabled by your school)",
      category: "college",
      sortOrder: 1,
    },
    {
      title: "Apprenticeships.gov",
      url: "https://www.apprenticeship.gov",
      description: "Earn-and-learn trade pathways",
      category: "college",
      sortOrder: 2,
    },
    {
      title: "Official transcripts (PGCPS)",
      url: "https://www.pgcps.org",
      description: "Request transcripts through your school registrar",
      category: "records",
      sortOrder: 1,
    },
    {
      title: "Dual enrollment information",
      url: "https://www.pgcps.org",
      description: "College courses while in high school",
      category: "records",
      sortOrder: 2,
    },
    {
      title: "PGCPS Mental Health Services",
      url: "https://www.pgcps.org",
      description: "School-based wellness supports",
      category: "wellness",
      sortOrder: 1,
    },
    {
      title: "StopBullying.gov",
      url: "https://www.stopbullying.gov",
      description: "Resources for students and families",
      category: "wellness",
      sortOrder: 2,
    },
  ];

  for (const r of resourceSeeds) {
    await ensureResource(r);
  }

  const students = await prisma.user.findMany({ where: { role: "STUDENT" } });
  const prefCategories = [
    DistrictLeaderboardCategory.GPA,
    DistrictLeaderboardCategory.SERVICE,
    DistrictLeaderboardCategory.ACADEMIC_CHALLENGE,
    DistrictLeaderboardCategory.LEADERSHIP,
  ];

  for (let idx = 0; idx < students.length; idx++) {
    const s = students[idx];
    for (const category of prefCategories) {
      await prisma.userLeaderboardPreference.upsert({
        where: { userId_category: { userId: s.id, category } },
        create: {
          userId: s.id,
          category,
          optedIn: idx < 9,
          verified: idx < 6,
        },
        update: {
          optedIn: idx < 9,
          verified: idx < 6,
        },
      });
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
