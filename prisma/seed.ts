import { PrismaClient, QuestionType } from "@prisma/client";

const prisma = new PrismaClient();

type Question = { prompt: string; type?: QuestionType; required?: boolean };
type Resource = { title: string; driveFileId: string };

type ModuleSeed = {
  slug: string;
  title: string;
  description?: string;
  order: number;
  videoDriveId?: string;
  questions?: Question[];
  resources?: Resource[];
};

const BUDGET_TEMPLATE: Resource = {
  title: "Personal Budget Template.xlsx",
  driveFileId: "1c2wRWI0hPBTGKLCPGM7d2vaz4Jq0nacm",
};
const NETWORTH_CALCULATOR: Resource = {
  title: "Networth Calculator.xlsx",
  driveFileId: "1y9j9MfCyc1_49wfH1nbNa-RywdrIyyGZ",
};

const MODULES: ModuleSeed[] = [
  {
    slug: "welcome",
    title: "Welcome",
    description:
      "A quick welcome before you start — what this course covers and how the modules fit together.",
    order: 0,
    videoDriveId: "1lZY3joy-_nZ5wmsMXqOzPsNqaZ4aPl8X",
  },
  {
    slug: "module-1-defining-your-end-goal",
    title: "Module 1: Defining Your End Goal",
    description:
      "Before you build anything, get clear on where you're going. You'll learn the three building blocks of a real end game — mission, vision, and SMART goals — and map out your own.",
    order: 1,
    videoDriveId: "1J2UmAzWLeZK13lUgHAGE2Fk2jbU9qnsI",
    questions: [
      {
        prompt:
          "What is your Mission? (Your reason for existing — something larger than yourself that can't be accomplished in your lifetime)",
      },
      {
        prompt:
          "What is your Vision? (A dated picture of your preferred future)",
      },
      {
        prompt:
          "What are your Goals? (Make them SMART — Specific, Measurable, Attainable, Realistic, Timely)",
      },
      {
        prompt: "What are your Tasks? (The concrete next steps toward your goals)",
      },
    ],
  },
  {
    slug: "module-2-can-the-real-you-please-stand-up",
    title: "Module 2: Can The Real You Please Stand Up?",
    description:
      "Figure out what makes you different. You'll uncover your unique selling proposition — the specific mix of talent, presence, and offer that's yours alone — and put it into one clear statement.",
    order: 2,
    videoDriveId: "10GOUkQgjtJ2Pt6dc-58Qj-L9XUsC0tMv",
    questions: [
      {
        prompt: "Ask a few friends: what is your genius? (Everyone is a genius at something)",
      },
      { prompt: "Ask a few friends: what are your top 3 attractive attributes?" },
      { prompt: "Ask a few friends: what would people happily pay you to do?" },
      { prompt: "How do you dress?", type: QuestionType.SHORT_TEXT },
      { prompt: "How do you interact with your fans (on stage, on social, etc.)?" },
      { prompt: "How do you carry yourself in public?" },
      { prompt: "What do people say about you?" },
      {
        prompt:
          "Write your USP statement — one sentence that captures who you are (e.g. \"I am a fun high energy MC; the best at team building events\"). Keep this internal — don't post it on social media.",
        type: QuestionType.SHORT_TEXT,
      },
    ],
  },
  {
    slug: "module-3-understanding-your-customer",
    title: "Module 3: Understanding Your Customer",
    description:
      "Stop creating for \"everyone.\" You'll define your actual target audience — who they are, what they care about, and what drives their decisions — so your work lands with the right people.",
    order: 3,
    videoDriveId: "17Kb0dL_aQyDUUJE9-nU7oFDPXtnWRKDg",
    questions: [
      {
        prompt:
          "Step 1 — Basic facts about your target audience: age range, gender, location, social media usage, education level, income bracket.",
      },
      {
        prompt:
          "Step 2 — Shared interests: music they listen to, concerts they attend, who they follow, what they do for fun, hobbies. Be as detailed as possible.",
      },
      {
        prompt:
          "Step 3 — Their psychology: how they like to be viewed, their beliefs, what moves them, what they want to achieve, their challenges, their purchasing habits.",
      },
    ],
  },
  {
    slug: "module-4-multiply-your-revenue-streams",
    title: "Module 4: Multiply Your Revenue Streams",
    description:
      "Get your money organized, then look for more of it. You'll build a real budget and map out your cash cow, quantum, and investment activities — the three kinds of income every creative needs.",
    order: 4,
    videoDriveId: "1anwZhhH8CbZg101yqK1TntfbDr4TZC-s",
    questions: [
      { prompt: "Describe your monthly budget (use the Personal Budget Template below)." },
      { prompt: "Break your monthly budget down into quarterly and annual numbers." },
      { prompt: "List your cash cow activities." },
      { prompt: "List your potential quantum activities." },
      { prompt: "List your potential investment activities." },
    ],
    resources: [BUDGET_TEMPLATE, NETWORTH_CALCULATOR],
  },
  {
    slug: "module-5-growing-your-tribe",
    title: "Module 5: Growing Your Tribe",
    description:
      "Turn an audience into a tribe. You'll walk through the process for identifying, inviting, and engaging the people who'll follow — and eventually pay for — your work.",
    order: 5,
    videoDriveId: "1UjgcuiIThyO8mQ4fWioez18iEmHu1jzP",
    questions: [
      {
        prompt:
          "Write your strategy for consistently inviting your tribe to your platforms (email lists, social media, etc.) — including the free content you'll create regularly.",
      },
      {
        prompt:
          "Write your tribe engagement strategy — how will you give your audience exclusive, special access to keep them happy and engaged?",
      },
    ],
  },
  {
    slug: "module-6-developing-a-killer-sales-strategy",
    title: "Module 6: Developing a Killer Sales Strategy",
    description:
      "Move people from noticing you to buying from you. You'll build a REACH strategy — Reach, Engage, Activate, Close, Harness — for turning attention into sales.",
    order: 6,
    videoDriveId: "1ZCb2NeqaP0hd3kTiW1zoftws30IJo9UO",
    questions: [
      {
        prompt:
          "Reach — what low-cost activities will get new people to see and engage with your art? How will you collect their emails/phone numbers?",
      },
      { prompt: "Engage — how will you keep in touch with your contacts using relevant content?" },
      { prompt: "Activate — what sales activities, promotions, or launches will you run?" },
      { prompt: "Close — how will you push your audience to make a purchasing decision?" },
      {
        prompt:
          "Harness — how will you leverage your audience's networks, recommendations, and repeat purchases?",
      },
    ],
  },
  {
    slug: "module-7-financial-goals-and-structures",
    title: "Module 7: Financial Goals and Structures",
    description:
      "Put real financial structure under your creative income. You'll work through the core principles of financial health and fill out your personal budget and net worth calculator.",
    order: 7,
    videoDriveId: "1qIodNDfmNkw8Q3KWnr7PMRjbZNnDKxdk",
    questions: [
      { prompt: "I've filled out my Personal Budget Template.", type: QuestionType.CHECKBOX },
      { prompt: "I've filled out my Net Worth Calculator.", type: QuestionType.CHECKBOX },
      { prompt: "What's one change you'll make based on your budget and net worth numbers?" },
    ],
    resources: [BUDGET_TEMPLATE, NETWORTH_CALCULATOR],
  },
  {
    slug: "module-8-put-it-all-together",
    title: "Module 8: Put It All Together",
    description:
      "Bring everything from Modules 1–7 together into one working plan for your creative business.",
    order: 8,
    videoDriveId: "1p0a7UWOBCj8soq55Bh3LzHr3NeZJ9bmN",
  },
  {
    slug: "module-9-in-closing",
    title: "Module 9: In Closing",
    description: "A final wrap-up — what you've built so far, and where to take it from here.",
    order: 9,
    videoDriveId: "1L6OgNtVbOoORi8o6RauqlfBTIfyq8m_r",
  },
  {
    slug: "bonus-1",
    title: "Bonus Lesson 1",
    description: "Extra material from Kanjii, outside the core nine modules.",
    order: 10,
    videoDriveId: "1-zV2EDMmBEWd6QUX0-ObhX35ozPld7Xd",
  },
  {
    slug: "bonus-2",
    title: "Bonus Lesson 2",
    description: "Extra material from Kanjii, outside the core nine modules.",
    order: 11,
    videoDriveId: "1mZW885T6hYZypUfvj82KCHqGdO0uknGR",
  },
  {
    slug: "bonus-3",
    title: "Bonus Lesson 3",
    description: "Extra material from Kanjii, outside the core nine modules.",
    order: 12,
    videoDriveId: "1xPQ80KG2sKcAU_cO1AbJZlL0ul3Abhzs",
  },
  {
    slug: "bonus-4",
    title: "Bonus Lesson 4",
    description: "Extra material from Kanjii, outside the core nine modules.",
    order: 13,
    videoDriveId: "1RplNyaIOB37xHdpwuA84bTvBF1qNq_c7",
  },
  {
    slug: "creative-money-strategy-questionnaire",
    title: "Creative Money Strategy Questionnaire",
    description:
      "The final step. Your answers here — combined with everything you've written throughout the course — become the input for your own Creative Money strategy, written just for you.",
    order: 14,
    questions: [
      {
        prompt:
          "In one sentence, what is the creative business or offer you're building? (Pull from your Mission, Vision, and USP work.)",
      },
      {
        prompt: "Who is the ONE audience you're committing to serve first? Describe them specifically.",
      },
      {
        prompt:
          "Which revenue streams will you prioritize in the next 90 days — your cash cow, quantum, or investment activities — and why?",
      },
      {
        prompt:
          "What's your tribe-growing plan for the next 90 days? How will you invite and engage people consistently?",
      },
      {
        prompt:
          "Walk through your REACH strategy as it stands today — your plan for Reach, Engage, Activate, Close, and Harness.",
      },
      {
        prompt: "What's the ONE financial habit or structure you're committing to starting this month?",
      },
      {
        prompt: "What's standing in your way right now — the biggest obstacle between you and executing this plan?",
      },
      {
        prompt: "If this plan works, what does your creative business look like in 12 months?",
      },
      {
        prompt: "What's the very first action you'll take in the next 7 days?",
        type: QuestionType.SHORT_TEXT,
      },
      {
        prompt: "Anything else you want your strategy to take into account?",
        required: false,
      },
    ],
  },
];

async function main() {
  for (const m of MODULES) {
    const courseModule = await prisma.module.upsert({
      where: { slug: m.slug },
      create: {
        slug: m.slug,
        title: m.title,
        description: m.description,
        order: m.order,
        videoDriveId: m.videoDriveId,
      },
      update: {
        title: m.title,
        description: m.description,
        order: m.order,
        videoDriveId: m.videoDriveId,
      },
    });

    if (m.questions) {
      const workbook = await prisma.workbook.upsert({
        where: { moduleId: courseModule.id },
        create: { moduleId: courseModule.id, title: `${m.title} Workbook` },
        update: { title: `${m.title} Workbook` },
      });

      for (const [i, q] of m.questions.entries()) {
        await prisma.workbookQuestion.upsert({
          where: { workbookId_order: { workbookId: workbook.id, order: i } },
          create: {
            workbookId: workbook.id,
            order: i,
            prompt: q.prompt,
            type: q.type ?? QuestionType.LONG_TEXT,
            required: q.required ?? true,
          },
          update: {
            prompt: q.prompt,
            type: q.type ?? QuestionType.LONG_TEXT,
            required: q.required ?? true,
          },
        });
      }
    }

    if (m.resources) {
      await prisma.moduleResource.deleteMany({ where: { moduleId: courseModule.id } });
      for (const r of m.resources) {
        await prisma.moduleResource.create({
          data: { moduleId: courseModule.id, title: r.title, driveFileId: r.driveFileId },
        });
      }
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
