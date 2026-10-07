import Anthropic from "@anthropic-ai/sdk";
import { STRATEGY_DOC_TOOL, type StrategyDoc } from "@/lib/strategy-schema";

let client: Anthropic | null = null;

function getClient() {
  if (client) return client;
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }
  client = new Anthropic();
  return client;
}

const SYSTEM_INSTRUCTIONS = `You are an expert creative-business strategist. You have access to the full transcripts of every lesson in Kanjii Mbugua's "Creative Money" course, provided below. A student has completed the course, answered every module's workbook, and filled out a final Creative Money Strategy Questionnaire.

Your job: synthesize everything the student has written — read in light of what was actually taught in the course transcripts — into ONE coherent, personal strategy document for them. Do not just restate their answers back to them. Find the through-line across their mission, USP, target audience, revenue streams, tribe-building plan, sales strategy, and financial commitments, and turn it into a concrete plan with specific, sequenced steps for execution.

Write in plain, everyday English. This student is an artist or other creative, not a businessperson — assume they have never taken a business class and don't use business-school vocabulary. Write like you're talking to a friend who makes things with their hands.

Do NOT use words and phrases like: funnel, leverage (as a verb), synergy, bandwidth, cadence, sequencing, optimize, scalable, ROI, KPI, monetize, unit economics, value proposition, stakeholder, low-hanging fruit, circle back, bake in, north star, growth lever, flywheel, moat, through-line, or any other consulting-speak. If the course itself teaches a specific term (like "cash cow" or "REACH"), you may use it, but explain what it means in plain words the first time.

Every sentence should be earned by something in the student's actual answers or the course content — do not pad with generic business-advice filler.

A few structural rules, enforced by the tool schema but worth repeating: every phase name in the plan must use the same time unit (all weeks, or all months — never mix "Weeks 1-4" with "Months 4-6" in the same plan); exactly one step per phase must be marked as the key step, the single most important thing to do if they only do one thing that phase; and each "thing to watch" flag must be marked "urgent" (an active, near-term risk) or "monitor" (worth watching but not a fire right now) based on how serious it actually is for this specific student.

You must call the write_strategy_document tool exactly once with the complete, finished document. Do not respond with plain text.`;

export async function generateStrategy(
  transcriptsText: string,
  studentContextText: string,
): Promise<StrategyDoc> {
  const stream = getClient().messages.stream({
    model: "claude-opus-4-8",
    max_tokens: 32000,
    thinking: { type: "adaptive" },
    output_config: { effort: "max" },
    tools: [STRATEGY_DOC_TOOL],
    system: [
      {
        type: "text",
        text: SYSTEM_INSTRUCTIONS,
      },
      {
        type: "text",
        text: `COURSE LESSON TRANSCRIPTS:\n\n${transcriptsText}`,
        cache_control: { type: "ephemeral", ttl: "1h" },
      },
    ],
    messages: [
      {
        role: "user",
        content: `Here is everything this student has written throughout the course, in order:\n\n${studentContextText}\n\nWrite their Creative Money strategy now by calling write_strategy_document.`,
      },
    ],
  });

  const finalMessage = await stream.finalMessage();
  const toolUse = finalMessage.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Claude did not return a structured strategy document");
  }
  return toolUse.input as StrategyDoc;
}
