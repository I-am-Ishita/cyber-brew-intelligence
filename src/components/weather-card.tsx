import { todaysWeather } from "@/lib/mock-data";

const map = {
  critical: { emoji: "🔴", label: "Critical", ring: "ring-rose-400/40", grad: "from-rose-500/30 via-orange-500/20", text: "text-rose-300" },
  high: { emoji: "🟠", label: "High", ring: "ring-orange-400/40", grad: "from-orange-500/30 via-amber-500/20", text: "text-orange-300" },
  medium: { emoji: "🟡", label: "Elevated", ring: "ring-amber-400/40", grad: "from-amber-500/30 via-yellow-500/20", text: "text-amber-300" },
  low: { emoji: "🟢", label: "Calm", ring: "ring-emerald-400/40", grad: "from-emerald-500/30 via-teal-500/20", text: "text-emerald-300" },
  info: { emoji: "🟢", label: "Calm", ring: "ring-emerald-400/40", grad: "from-emerald-500/30 via-teal-500/20", text: "text-emerald-300" },
} as const;

export function WeatherCard() {
  const w = todaysWeather();
  const m = map[w.level];
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br ${m.grad} to-transparent p-6 ring-1 ${m.ring}`}>
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Today's Cyber Weather</div>
          <div className="mt-1 flex items-center gap-3">
            <span className="text-4xl">{m.emoji}</span>
            <span className={`font-display text-3xl font-bold ${m.text}`}>{m.label}</span>
          </div>
        </div>
        <span className="rounded-full border border-border bg-card/60 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          Live
        </span>
      </div>
      <ul className="mt-4 space-y-1.5">
        {w.reasons.map((r) => (
          <li key={r} className="flex items-start gap-2 text-sm text-foreground/90">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/50" />
            {r}
          </li>
        ))}
      </ul>
    </div>
  );
}