export type StrategyDoc = {
  title: string;
  oneLineSummary: string;
  whoYouAre: string;
  theBigIdea: {
    heading: string;
    body: string;
  };
  moneyPicture: {
    currency: string;
    monthlyMoneyIn: number;
    monthlyMoneyOut: number;
    note: string;
  } | null;
  priorities: {
    name: string;
    when: "now" | "soon" | "later";
    why: string;
  }[];
  plan: {
    phaseName: string;
    phaseGoal: string;
    steps: {
      text: string;
      isKeyStep: boolean;
    }[];
  }[];
  thingsToWatch: {
    heading: string;
    body: string;
    severity: "urgent" | "monitor";
  }[];
  closingNote: string;
};

export const STRATEGY_DOC_TOOL = {
  name: "write_strategy_document",
  description:
    "Write the student's complete, finished Creative Money strategy document as structured data.",
  input_schema: {
    type: "object" as const,
    properties: {
      title: {
        type: "string",
        description: "e.g. \"Your Creative Money Strategy\"",
      },
      oneLineSummary: {
        type: "string",
        description:
          "One plain-English sentence describing what this person is building, in their own kind of language.",
      },
      whoYouAre: {
        type: "string",
        description:
          "2-4 short sentences, plain English, grounded in their actual answers. No jargon.",
      },
      theBigIdea: {
        type: "object",
        properties: {
          heading: {
            type: "string",
            description: "A short, friendly heading, not a business term.",
          },
          body: {
            type: "string",
            description:
              "2-4 short paragraphs (separated by a blank line) in plain, everyday English explaining the one idea that ties their plan together.",
          },
        },
        required: ["heading", "body"],
      },
      moneyPicture: {
        type: ["object", "null"],
        description:
          "Only include if the student gave real monthly income/expense numbers anywhere in their answers. Otherwise null.",
        properties: {
          currency: { type: "string", description: "e.g. \"GHS\", \"$\", \"KES\"" },
          monthlyMoneyIn: { type: "number" },
          monthlyMoneyOut: { type: "number" },
          note: {
            type: "string",
            description: "One short plain-English sentence on what this means for them.",
          },
        },
        required: ["currency", "monthlyMoneyIn", "monthlyMoneyOut", "note"],
      },
      priorities: {
        type: "array",
        description:
          "3-5 items. What they should focus on, ranked by timing. Plain language names, not 'revenue stream' labels.",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            when: { type: "string", enum: ["now", "soon", "later"] },
            why: { type: "string", description: "One plain-English sentence." },
          },
          required: ["name", "when", "why"],
        },
      },
      plan: {
        type: "array",
        description:
          "2-4 phases, in order, covering roughly the next 3-6 months. Every phaseName across the WHOLE plan must use the exact same time unit (all \"Weeks\" ranges, e.g. \"Weeks 1-4\", \"Weeks 5-12\", \"Weeks 13-24\" — never mix in a \"Months\" phase alongside \"Weeks\" phases).",
        items: {
          type: "object",
          properties: {
            phaseName: {
              type: "string",
              description:
                "e.g. \"Weeks 1-4\". Must share the same unit (weeks or months, pick one for the whole plan) as every other phaseName in this document.",
            },
            phaseGoal: {
              type: "string",
              description: "One short plain-English sentence: the point of this phase.",
            },
            steps: {
              type: "array",
              description:
                "3-6 short, concrete, plain-English action items. Exactly ONE of them must have isKeyStep: true — the single most important action in this phase, the one thing to do if they only do one. All the rest must be isKeyStep: false.",
              items: {
                type: "object",
                properties: {
                  text: { type: "string" },
                  isKeyStep: {
                    type: "boolean",
                    description: "True for exactly one step per phase; false for all others.",
                  },
                },
                required: ["text", "isKeyStep"],
              },
            },
          },
          required: ["phaseName", "phaseGoal", "steps"],
        },
      },
      thingsToWatch: {
        type: "array",
        description:
          "2-4 honest flags where their answers are inconsistent, vague, or point at an unaddressed problem. Plain English, direct but kind.",
        items: {
          type: "object",
          properties: {
            heading: { type: "string", description: "A short, plain-language label for the issue." },
            body: { type: "string", description: "2-4 sentences explaining it and the fix." },
            severity: {
              type: "string",
              enum: ["urgent", "monitor"],
              description:
                "\"urgent\" if this could actively hurt them soon (e.g. a math problem that leaves them short on rent) and should be fixed before anything else. \"monitor\" if it's a longer-term thing to keep an eye on, not an immediate fire.",
            },
          },
          required: ["heading", "body", "severity"],
        },
      },
      closingNote: {
        type: "string",
        description: "1-3 encouraging plain-English sentences to end on.",
      },
    },
    required: [
      "title",
      "oneLineSummary",
      "whoYouAre",
      "theBigIdea",
      "moneyPicture",
      "priorities",
      "plan",
      "thingsToWatch",
      "closingNote",
    ],
  },
};
