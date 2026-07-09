import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { THREAT_EVENTS, type ThreatEvent, severityColor } from "@/lib/mock-data";
import { WorldMap } from "@/components/world-map";

export const Route = createFileRoute("/app/threats")({
  component: ThreatsPage,
  head: () => ({ meta: [{ title: "Threat Map — Cyber Brew" }] }),
});

function ThreatsPage() {
  const [selected, setSelected] = useState<ThreatEvent | null>(null);
  const country = selected?.country;
  const events = country ? THREAT_EVENTS.filter((e) => e.country === country) : THREAT_EVENTS;
  const industries = Array.from(new Set(events.map((e) => e.industry)));

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Interactive Threat Map</h1>
        <p className="mt-1 text-muted-foreground">Live attacks, breaches and campaigns worldwide. Click a marker to zoom in.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WorldMap onSelect={setSelected} />
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            {["critical", "high", "medium", "low"].map((s) => (
              <span key={s} className="inline-flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${severityColor(s as any).split(" ")[0].replace("text-", "bg-")}`} />
                {s}
              </span>
            ))}
          </div>
        </div>
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Focus</div>
            <div className="mt-1 font-display text-xl font-semibold">{country ?? "Worldwide"}</div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              {(["critical", "high", "medium"] as const).map((sv) => {
                const n = events.filter((e) => e.severity === sv).length;
                return (
                  <div key={sv} className="rounded-xl border border-border/50 bg-card/40 p-2">
                    <div className="font-display text-lg font-bold">{n}</div>
                    <div className="text-[10px] uppercase text-muted-foreground">{sv}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/50 p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Industries targeted</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {industries.map((i) => (
                <span key={i} className="rounded-full border border-border bg-accent/40 px-2 py-0.5 text-xs">{i}</span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/50 p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Incident timeline</div>
            <ul className="mt-3 space-y-3">
              {events.map((e) => (
                <li key={e.id} className="flex gap-3">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${severityColor(e.severity).split(" ")[0].replace("text-", "bg-")}`} />
                  <div>
                    <div className="text-sm font-medium">{e.title}</div>
                    <div className="text-xs text-muted-foreground">{e.country} · {e.industry} · {e.time}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}