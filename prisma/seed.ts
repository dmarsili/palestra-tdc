import { PrismaClient, Track } from "@prisma/client";

const prisma = new PrismaClient();

const companies = [
  "TechCorp",
  "InovaX",
  "DataWise",
  "ProdMasters",
  "CloudNova",
  "DevFlow",
  "ByteLabs",
  "AI Horizon",
];

const cities = ["São Paulo", "Florianópolis", "Porto Alegre", "Belo Horizonte"];
const tracks: Track[] = ["ENGENHARIA", "DADOS", "PRODUTO"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomName(idx: number) {
  const first = [
    "Ana",
    "Bruno",
    "Carla",
    "Diego",
    "Eduarda",
    "Felipe",
    "Gustavo",
    "Helena",
    "Igor",
    "Juliana",
    "Karen",
    "Luiz",
    "Marina",
    "Nicolas",
    "Olivia",
    "Paulo",
    "Raquel",
    "Sofia",
    "Thiago",
    "Vivian",
  ];
  const last = [
    "Souza",
    "Lima",
    "Mendes",
    "Santos",
    "Rocha",
    "Pereira",
    "Almeida",
    "Fernandes",
    "Gonçalves",
    "Araújo",
  ];
  return `${pick(first)} ${pick(last)} ${idx}`;
}

function seniorityBeforeFor(track: Track) {
  const map: Record<Track, string[]> = {
    ENGENHARIA: ["Sênior", "Tech Lead", "Staff"],
    DADOS: ["Sênior", "Tech Lead", "Staff"],
    PRODUTO: ["PM Sênior", "Group PM", "Principal PM"],
  };
  return pick(map[track]);
}

function seniorityAfterFor(before: string) {
  const promotions: Record<string, string> = {
    "Sênior": "Tech Lead",
    "Tech Lead": "Staff",
    "Staff": "Principal",
    "PM Sênior": "Group PM",
    "Group PM": "Principal PM",
    "Principal PM": "Director PM",
  };
  return promotions[before] ?? before;
}

async function main() {
  await prisma.oKRKeyResult.deleteMany();
  await prisma.oKR.deleteMany();
  await prisma.mentoria.deleteMany();
  await prisma.leader.deleteMany();
  await prisma.eventoTDC.deleteMany();

  // Seed TDC events
  const events = await Promise.all(
    Array.from({ length: 8 }).map((_, i) =>
      prisma.eventoTDC.create({
        data: {
          city: pick(cities),
          date: new Date(2024 + Math.floor(i / 4), (i % 4) * 3, 10),
          track: pick(tracks),
          estimatedAudience: 500 + Math.floor(Math.random() * 800),
        },
      })
    )
  );

  const leaders = await Promise.all(
    Array.from({ length: 120 }).map((_, i) => {
      const track = pick(tracks);
      const attendedTDC = Math.random() < 0.7;
      const talkDate = new Date(2024, pick([2, 5, 8, 11]), pick([5, 12, 18, 25]));
      const before = seniorityBeforeFor(track);
      const promotedWithin12m = Math.random() < 0.35;
      const promotionDate = promotedWithin12m
        ? new Date(talkDate.getFullYear(), talkDate.getMonth() + 6 + Math.floor(Math.random() * 6), talkDate.getDate())
        : null;

      return prisma.leader.create({
        data: {
          name: randomName(i + 1),
          company: pick(companies),
          track,
          seniorityBefore: before,
          seniorityAfter: promotedWithin12m ? seniorityAfterFor(before) : null,
          attendedTDC,
          talkDate,
          sessionNps: 7.5 + Math.random() * 2.5, // ~8.2 avg
          promoted: !!promotionDate,
          promotionDate: promotionDate ?? undefined,
        },
      });
    })
  );

  // Mentorings: 40% with >= 8h
  for (const leader of leaders) {
    const hasMentoring = Math.random() < 0.7;
    if (!hasMentoring) continue;
    const start = new Date(2024, pick([0, 3, 6, 9]), 15);
    const months = pick([2, 3, 4, 5, 6]);
    const end = Math.random() < 0.6 ? new Date(start.getFullYear(), start.getMonth() + months, 15) : null;
    const hours = 4 * pick([1, 2]); // 4h or 8h per month baseline
    await prisma.mentoria.create({
      data: {
        leaderId: leader.id,
        startDate: start,
        endDate: end ?? undefined,
        topics: ["liderança técnica", "comunicação", "estratégia"],
        hours: hours,
      },
    });
  }

  // OKRs per leader (1-2)
  for (const leader of leaders) {
    const numOkrs = 1 + (Math.random() < 0.4 ? 1 : 0);
    for (let j = 0; j < numOkrs; j++) {
      const quarter = pick(["2024-Q3", "2024-Q4", "2025-Q1", "2025-Q2", "2025-Q3"]);
      const okr = await prisma.oKR.create({
        data: {
          ownerId: leader.id,
          objective: "Evoluir capacidades de engenharia e liderança",
          quarter,
          progress: Math.random(),
        },
      });
      const keyResults = [
        { description: "Lead time médio (dias)", target: 7, current: 6 + Math.random() * 6 },
        { description: "Deploys/semana", target: 6, current: 3 + Math.random() * 5 },
        { description: "MTTR (h)", target: 6, current: 4 + Math.random() * 6 },
      ];
      for (const kr of keyResults) {
        await prisma.oKRKeyResult.create({
          data: { okrId: okr.id, ...kr },
        });
      }
    }
  }

  console.log("Seed completed:", {
    leaders: await prisma.leader.count(),
    mentorias: await prisma.mentoria.count(),
    okrs: await prisma.oKR.count(),
    krs: await prisma.oKRKeyResult.count(),
    events: await prisma.eventoTDC.count(),
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



