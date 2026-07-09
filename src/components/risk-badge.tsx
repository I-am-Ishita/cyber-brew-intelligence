import { riskColor } from "@/lib/mock-data";

export function RiskBadge({ score, size = "sm" }: { score: number; size?: "sm" | "lg" }) {
  const cls = riskColor(score);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono font-medium ${cls} ${
        size === "lg" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs"
      }`}
      title={`AI Risk Score: ${score.toFixed(1)} / 10`}
    >
      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor"><circle cx="12" cy="12" r="6" /></svg>
      Risk {score.toFixed(1)}
    </span>
  );
}

export function SeverityPill({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    critical: "text-rose-300 bg-rose-500/15 border-rose-400/30",
    high: "text-orange-300 bg-orange-500/15 border-orange-400/30",
    medium: "text-amber-300 bg-amber-500/15 border-amber-400/30",
    low: "text-emerald-300 bg-emerald-500/15 border-emerald-400/30",
    info: "text-sky-300 bg-sky-500/15 border-sky-400/30",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${map[severity] ?? map.info}`}>
      {severity}
    </span>
  );
}