import path from "path";
import {
  Document,
  Page,
  View,
  Text,
  Svg,
  Circle,
  Line,
  StyleSheet,
  Font,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { StrategyDoc } from "@/lib/strategy-schema";

const FONT_DIR = path.join(process.cwd(), "src/fonts");

Font.register({
  family: "Fraunces",
  fonts: [
    { src: path.join(FONT_DIR, "Fraunces-Regular.woff"), fontWeight: 400 },
    { src: path.join(FONT_DIR, "Fraunces-Bold.woff"), fontWeight: 700 },
  ],
});
Font.register({
  family: "Inter",
  fonts: [
    { src: path.join(FONT_DIR, "Inter-Regular.woff"), fontWeight: 400 },
    { src: path.join(FONT_DIR, "Inter-Bold.woff"), fontWeight: 700 },
    { src: path.join(FONT_DIR, "Inter-Italic.woff"), fontStyle: "italic" },
  ],
});
Font.registerHyphenationCallback((word) => [word]);

const COLOR = {
  ink: "#141a2b",
  paper: "#f7f3ea",
  paperRaised: "#fbf9f4",
  paperLine: "#e4dcc8",
  brass: "#b8863b",
  brassLight: "#d9a857",
  moss: "#4c6b4f",
  mossLight: "#e4ebe2",
  text: "#2b2a26",
  textMuted: "#6b6558",
  cream: "#f3f1ea",
  rust: "#a1522f",
  rustLight: "#f3e4dc",
};

const WHEN_COLOR: Record<string, string> = {
  now: COLOR.moss,
  soon: COLOR.brass,
  later: COLOR.textMuted,
};

const WHEN_LABEL: Record<string, string> = {
  now: "START NOW",
  soon: "SOON",
  later: "LATER",
};

const styles = StyleSheet.create({
  coverPage: {
    backgroundColor: COLOR.ink,
    padding: 64,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "100%",
  },
  coverEyebrow: {
    fontFamily: "Inter",
    fontWeight: 700,
    fontSize: 11,
    color: COLOR.brassLight,
    letterSpacing: 2,
    marginBottom: 14,
  },
  coverTitle: {
    fontFamily: "Fraunces",
    fontWeight: 700,
    fontSize: 34,
    color: COLOR.cream,
    marginBottom: 20,
    lineHeight: 1.3,
  },
  coverRule: {
    width: 60,
    height: 2,
    backgroundColor: COLOR.brass,
    marginBottom: 20,
  },
  coverSummary: {
    fontFamily: "Inter",
    fontSize: 13,
    color: "#cfcabd",
    lineHeight: 1.6,
  },
  coverFooter: {
    position: "absolute",
    bottom: 48,
    left: 64,
    right: 64,
    fontFamily: "Inter",
    fontSize: 9,
    color: "#8a8577",
  },
  page: {
    backgroundColor: COLOR.paper,
    padding: 48,
    fontFamily: "Inter",
    fontSize: 11,
    color: COLOR.text,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 6,
  },
  sectionEyebrow: {
    fontFamily: "Inter",
    fontWeight: 700,
    fontSize: 9,
    color: COLOR.brass,
    letterSpacing: 1.5,
  },
  sectionHeading: {
    fontFamily: "Fraunces",
    fontWeight: 700,
    fontSize: 18,
    color: COLOR.text,
    marginBottom: 10,
  },
  paragraph: {
    fontFamily: "Inter",
    fontSize: 11,
    lineHeight: 1.6,
    color: COLOR.text,
    marginBottom: 8,
  },
  section: {
    marginBottom: 26,
  },
  calloutBox: {
    backgroundColor: COLOR.paperRaised,
    borderLeft: `3px solid ${COLOR.brass}`,
    padding: 16,
    borderRadius: 2,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  chartLabel: {
    width: 110,
    fontFamily: "Inter",
    fontWeight: 700,
    fontSize: 10,
    color: COLOR.text,
  },
  chartTrack: {
    flex: 1,
    height: 16,
    backgroundColor: COLOR.paperLine,
    borderRadius: 3,
    flexDirection: "row",
  },
  chartBar: {
    height: 16,
    borderRadius: 3,
  },
  chartValue: {
    width: 80,
    textAlign: "right",
    fontFamily: "Inter",
    fontWeight: 700,
    fontSize: 10,
    color: COLOR.text,
  },
  surplusTile: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 3,
    padding: 12,
  },
  surplusNumber: {
    fontFamily: "Fraunces",
    fontWeight: 700,
    fontSize: 20,
  },
  surplusLabel: {
    fontFamily: "Inter",
    fontSize: 9,
    color: COLOR.textMuted,
    maxWidth: 320,
    lineHeight: 1.4,
  },
  priorityBoard: {
    flexDirection: "row",
    gap: 10,
  },
  priorityColumn: {
    flex: 1,
  },
  priorityChip: {
    fontFamily: "Inter",
    fontWeight: 700,
    fontSize: 8,
    color: "#fff",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 3,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  priorityCard: {
    backgroundColor: COLOR.paperRaised,
    borderWidth: 1,
    borderColor: COLOR.paperLine,
    borderRadius: 3,
    padding: 10,
    marginBottom: 8,
  },
  priorityName: {
    fontFamily: "Inter",
    fontWeight: 700,
    fontSize: 10,
    marginBottom: 3,
  },
  priorityWhy: {
    fontFamily: "Inter",
    fontSize: 9,
    color: COLOR.textMuted,
    lineHeight: 1.4,
  },
  priorityEmpty: {
    fontFamily: "Inter",
    fontStyle: "italic",
    fontSize: 9,
    color: COLOR.textMuted,
  },
  phaseRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  phaseRail: {
    width: 28,
    alignItems: "center",
  },
  phaseDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLOR.brass,
    alignItems: "center",
    justifyContent: "center",
  },
  phaseDotText: {
    fontFamily: "Inter",
    fontWeight: 700,
    fontSize: 9,
    color: "#fff",
  },
  phaseLine: {
    width: 2,
    flex: 1,
    backgroundColor: COLOR.paperLine,
    marginTop: 2,
  },
  phaseBody: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 20,
  },
  phaseName: {
    fontFamily: "Fraunces",
    fontWeight: 700,
    fontSize: 13,
    marginBottom: 2,
  },
  phaseGoal: {
    fontFamily: "Inter",
    fontStyle: "italic",
    fontSize: 10,
    color: COLOR.textMuted,
    marginBottom: 8,
  },
  stepRow: {
    flexDirection: "row",
    marginBottom: 5,
    alignItems: "flex-start",
  },
  stepRowKey: {
    backgroundColor: COLOR.mossLight,
    borderRadius: 3,
    padding: 6,
    marginLeft: -6,
    marginRight: -6,
  },
  stepBulletBox: {
    width: 12,
    paddingTop: 3,
  },
  stepBullet: {
    fontSize: 10,
    color: COLOR.moss,
  },
  stepText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.5,
  },
  stepTextKey: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.5,
    fontFamily: "Inter",
    fontWeight: 700,
  },
  watchCard: {
    backgroundColor: COLOR.paperRaised,
    padding: 12,
    marginBottom: 10,
    borderRadius: 2,
  },
  watchCardUrgent: {
    borderLeft: `3px solid ${COLOR.rust}`,
  },
  watchCardMonitor: {
    borderLeft: `3px solid ${COLOR.textMuted}`,
  },
  watchBadge: {
    alignSelf: "flex-start",
    fontFamily: "Inter",
    fontWeight: 700,
    fontSize: 7,
    letterSpacing: 0.5,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 2,
    marginBottom: 6,
  },
  watchBadgeUrgent: {
    backgroundColor: COLOR.rust,
    color: "#fff",
  },
  watchBadgeMonitor: {
    backgroundColor: "transparent",
    color: COLOR.textMuted,
    borderWidth: 1,
    borderColor: COLOR.paperLine,
  },
  watchHeading: {
    fontFamily: "Inter",
    fontWeight: 700,
    fontSize: 11,
    marginBottom: 4,
    color: COLOR.text,
  },
  watchBody: {
    fontSize: 10,
    lineHeight: 1.5,
    color: COLOR.text,
  },
  closingPage: {
    backgroundColor: COLOR.ink,
    padding: 64,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  closingText: {
    fontFamily: "Inter",
    fontStyle: "italic",
    fontSize: 14,
    color: COLOR.cream,
    textAlign: "center",
    lineHeight: 1.7,
    maxWidth: 380,
  },
  pageFooter: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    fontFamily: "Inter",
    fontSize: 8,
    color: COLOR.textMuted,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

type IconKind = "who" | "idea" | "money" | "focus" | "plan" | "watch";

function SectionIcon({ kind }: { kind: IconKind }) {
  const inner = (() => {
    switch (kind) {
      case "who":
        return <Circle cx={8} cy={8} r={2.6} fill={COLOR.brass} />;
      case "idea":
        return (
          <>
            <Circle cx={8} cy={8} r={2.4} fill={COLOR.brass} />
            <Line x1={8} y1={2.5} x2={8} y2={4.2} stroke={COLOR.brass} strokeWidth={1.1} />
            <Line x1={8} y1={11.8} x2={8} y2={13.5} stroke={COLOR.brass} strokeWidth={1.1} />
            <Line x1={2.5} y1={8} x2={4.2} y2={8} stroke={COLOR.brass} strokeWidth={1.1} />
            <Line x1={11.8} y1={8} x2={13.5} y2={8} stroke={COLOR.brass} strokeWidth={1.1} />
          </>
        );
      case "money":
        return (
          <Line x1={5} y1={8} x2={11} y2={8} stroke={COLOR.brass} strokeWidth={1.3} />
        );
      case "focus":
        return (
          <>
            <Circle cx={5.5} cy={5.5} r={1.1} fill={COLOR.brass} />
            <Circle cx={5.5} cy={8} r={1.1} fill={COLOR.brass} />
            <Circle cx={5.5} cy={10.5} r={1.1} fill={COLOR.brass} />
            <Line x1={8} y1={5.5} x2={11} y2={5.5} stroke={COLOR.brass} strokeWidth={1} />
            <Line x1={8} y1={8} x2={11} y2={8} stroke={COLOR.brass} strokeWidth={1} />
            <Line x1={8} y1={10.5} x2={11} y2={10.5} stroke={COLOR.brass} strokeWidth={1} />
          </>
        );
      case "plan":
        return (
          <>
            <Circle cx={5} cy={10.5} r={1.3} fill={COLOR.brass} />
            <Circle cx={11} cy={5.5} r={1.3} fill={COLOR.brass} />
            <Line x1={6.1} y1={9.7} x2={9.9} y2={6.3} stroke={COLOR.brass} strokeWidth={1.1} />
          </>
        );
      case "watch":
        return (
          <>
            <Line x1={8} y1={5} x2={8} y2={8.8} stroke={COLOR.brass} strokeWidth={1.3} />
            <Circle cx={8} cy={11} r={0.9} fill={COLOR.brass} />
          </>
        );
    }
  })();
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16">
      <Circle cx={8} cy={8} r={7} stroke={COLOR.brass} strokeWidth={1} fill="none" />
      {inner}
    </Svg>
  );
}

function SectionHeader({ icon, label }: { icon: IconKind; label: string }) {
  return (
    <View style={styles.sectionHeader} minPresenceAhead={70}>
      <SectionIcon kind={icon} />
      <Text style={styles.sectionEyebrow}>{label}</Text>
    </View>
  );
}

function healthForMargin(marginPct: number) {
  if (marginPct < 0) {
    return { color: COLOR.rust, bg: COLOR.rustLight, label: "You're behind" };
  }
  if (marginPct < 0.15) {
    return { color: COLOR.brass, bg: "#f6ecd9", label: "Thin cushion" };
  }
  return { color: COLOR.moss, bg: COLOR.mossLight, label: "Healthy margin" };
}

function MoneyBarChart({
  currency,
  moneyIn,
  moneyOut,
}: {
  currency: string;
  moneyIn: number;
  moneyOut: number;
}) {
  const max = Math.max(moneyIn, moneyOut, 1);
  const fmt = (n: number) => `${currency} ${Math.abs(n).toLocaleString()}`;
  const surplus = moneyIn - moneyOut;
  const marginPct = moneyIn > 0 ? surplus / moneyIn : 0;
  const health = healthForMargin(marginPct);

  return (
    <View wrap={false}>
      <View style={styles.chartRow}>
        <Text style={styles.chartLabel}>Money coming in</Text>
        <View style={styles.chartTrack}>
          <View
            style={{
              ...styles.chartBar,
              width: `${Math.max((moneyIn / max) * 100, 4)}%`,
              backgroundColor: COLOR.moss,
            }}
          />
        </View>
        <Text style={styles.chartValue}>{fmt(moneyIn)}</Text>
      </View>
      <View style={styles.chartRow}>
        <Text style={styles.chartLabel}>Money going out</Text>
        <View style={styles.chartTrack}>
          <View
            style={{
              ...styles.chartBar,
              width: `${Math.max((moneyOut / max) * 100, 4)}%`,
              backgroundColor: COLOR.brass,
            }}
          />
        </View>
        <Text style={styles.chartValue}>{fmt(moneyOut)}</Text>
      </View>
      <View style={{ ...styles.surplusTile, backgroundColor: health.bg }}>
        <Text style={{ ...styles.surplusNumber, color: health.color }}>
          {surplus >= 0 ? "+" : "-"}
          {fmt(surplus)}
        </Text>
        <Text style={styles.surplusLabel}>
          <Text style={{ fontFamily: "Inter", fontWeight: 700, color: health.color }}>
            {health.label}.{" "}
          </Text>
          What&apos;s left over each month, after expenses.
        </Text>
      </View>
    </View>
  );
}

function PriorityBoard({ priorities }: { priorities: StrategyDoc["priorities"] }) {
  const columns: Array<"now" | "soon" | "later"> = ["now", "soon", "later"];
  return (
    <View style={styles.priorityBoard}>
      {columns.map((when) => {
        const items = priorities.filter((p) => p.when === when);
        return (
          <View key={when} style={styles.priorityColumn}>
            <Text style={{ ...styles.priorityChip, backgroundColor: WHEN_COLOR[when] }}>
              {WHEN_LABEL[when]}
            </Text>
            {items.length === 0 ? (
              <Text style={styles.priorityEmpty}>Nothing here yet.</Text>
            ) : (
              items.map((p, i) => (
                <View key={i} style={styles.priorityCard} wrap={false}>
                  <Text style={styles.priorityName}>{p.name}</Text>
                  <Text style={styles.priorityWhy}>{p.why}</Text>
                </View>
              ))
            )}
          </View>
        );
      })}
    </View>
  );
}

function Plan({ plan }: { plan: StrategyDoc["plan"] }) {
  return (
    <View>
      {plan.map((phase, i) => (
        <View key={i} style={styles.phaseRow} wrap={false}>
          <View style={styles.phaseRail}>
            <View style={styles.phaseDot}>
              <Text style={styles.phaseDotText}>{i + 1}</Text>
            </View>
            {i < plan.length - 1 && <View style={styles.phaseLine} />}
          </View>
          <View style={styles.phaseBody}>
            <Text style={styles.phaseName}>{phase.phaseName}</Text>
            <Text style={styles.phaseGoal}>{phase.phaseGoal}</Text>
            {phase.steps.map((step, j) => (
              <View
                key={j}
                style={step.isKeyStep ? { ...styles.stepRow, ...styles.stepRowKey } : styles.stepRow}
              >
                <View style={styles.stepBulletBox}>
                  {step.isKeyStep ? (
                    <Svg width={10} height={10} viewBox="0 0 10 10">
                      <Circle cx={5} cy={5} r={4} fill={COLOR.brass} />
                    </Svg>
                  ) : (
                    <Text style={styles.stepBullet}>{"•"}</Text>
                  )}
                </View>
                <Text style={step.isKeyStep ? styles.stepTextKey : styles.stepText}>
                  {step.text}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/\n\s*\n/)
        .filter(Boolean)
        .map((p, i) => (
          <Text key={i} style={styles.paragraph}>
            {p.trim()}
          </Text>
        ))}
    </>
  );
}

function PageFooter({ studentName }: { studentName: string }) {
  return (
    <View style={styles.pageFooter} fixed>
      <Text>Creative Money Strategy — {studentName}</Text>
      <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
    </View>
  );
}

export function StrategyPdfDocument({
  doc,
  studentName,
  generatedAt,
}: {
  doc: StrategyDoc;
  studentName: string;
  generatedAt: Date;
}) {
  const dateStr = generatedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const sortedWatch = [...doc.thingsToWatch].sort((a, b) => {
    if (a.severity === b.severity) return 0;
    return a.severity === "urgent" ? -1 : 1;
  });

  return (
    <Document title={doc.title} author="Creative Money">
      <Page size="A4" style={styles.coverPage}>
        <Text style={styles.coverEyebrow}>CREATIVE MONEY · {studentName.toUpperCase()}</Text>
        <Text style={styles.coverTitle}>{doc.title}</Text>
        <View style={styles.coverRule} />
        <Text style={styles.coverSummary}>{doc.oneLineSummary}</Text>
        <Text style={styles.coverFooter}>Prepared {dateStr}</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <SectionHeader icon="who" label="WHO YOU ARE" />
          <Paragraphs text={doc.whoYouAre} />
        </View>

        <View style={styles.section}>
          <SectionHeader icon="idea" label="THE BIG IDEA" />
          <Text style={styles.sectionHeading}>{doc.theBigIdea.heading}</Text>
          <View style={styles.calloutBox} wrap={false}>
            <Paragraphs text={doc.theBigIdea.body} />
          </View>
        </View>

        {doc.moneyPicture && (
          <View style={styles.section} wrap={false}>
            <SectionHeader icon="money" label="YOUR MONEY PICTURE" />
            <MoneyBarChart
              currency={doc.moneyPicture.currency}
              moneyIn={doc.moneyPicture.monthlyMoneyIn}
              moneyOut={doc.moneyPicture.monthlyMoneyOut}
            />
            <Text style={{ ...styles.paragraph, marginTop: 8 }}>{doc.moneyPicture.note}</Text>
          </View>
        )}

        <View style={styles.section}>
          <SectionHeader icon="focus" label="WHAT TO FOCUS ON" />
          <PriorityBoard priorities={doc.priorities} />
        </View>

        <PageFooter studentName={studentName} />
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <SectionHeader icon="plan" label="YOUR PLAN" />
          <Plan plan={doc.plan} />
        </View>

        <View style={styles.section}>
          <SectionHeader icon="watch" label="THINGS TO WATCH FOR" />
          {sortedWatch.map((flag, i) => (
            <View
              key={i}
              style={
                flag.severity === "urgent"
                  ? { ...styles.watchCard, ...styles.watchCardUrgent }
                  : { ...styles.watchCard, ...styles.watchCardMonitor }
              }
              wrap={false}
            >
              <Text
                style={
                  flag.severity === "urgent"
                    ? { ...styles.watchBadge, ...styles.watchBadgeUrgent }
                    : { ...styles.watchBadge, ...styles.watchBadgeMonitor }
                }
              >
                {flag.severity === "urgent" ? "FIX THIS FIRST" : "KEEP AN EYE ON THIS"}
              </Text>
              <Text style={styles.watchHeading}>{flag.heading}</Text>
              <Text style={styles.watchBody}>{flag.body}</Text>
            </View>
          ))}
        </View>

        <PageFooter studentName={studentName} />
      </Page>

      <Page size="A4" style={styles.closingPage}>
        <Text style={styles.closingText}>{doc.closingNote}</Text>
      </Page>
    </Document>
  );
}

export async function renderStrategyPdf(
  doc: StrategyDoc,
  studentName: string,
  generatedAt: Date,
): Promise<Buffer> {
  return renderToBuffer(
    <StrategyPdfDocument doc={doc} studentName={studentName} generatedAt={generatedAt} />,
  );
}
