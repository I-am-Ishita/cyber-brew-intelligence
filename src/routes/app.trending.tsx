import { createFileRoute, Link } from "@tanstack/react-router";
import { ARTICLES, CVES, MALWARE, THREAT_ACTORS } from "@/lib/mock-data";
import { NewsCard } from "@/components/news-card";
import { RiskBadge, SeverityPill } from "@/components/risk-badge";
import { Section } from "@/components/section";

export const Route = createFileRoute("/app/trending")({
  component: TrendingPage,
  head: () => ({ meta: [{ title: "Trending — Cyber Brew" }] }),
});

function TrendingPage() {
  const topArticles = [...ARTICLES].sort((a, b) => b.riskScore - a.riskScore).slice(0, 6);
  const topCves = [...CVES].sort((a, b) => b.riskScore - a.riskScore).slice(0, 6);
  return (
    <div className="mx-auto max-w-7xl space-y-10">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Trending</h1>
        <p className="mt-1 text-muted-foreground">What the industry is watching, right now.</p>
      </div>

      <Section title="Trending news">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topArticles.map((a) => <NewsCard key={a.id} article={a} />)}
        </div>
      </Section>

      <Section title="Trending CVEs" href="/app/cves">
        <div className="grid gap-2 md:grid-cols-2">
          {topCves.map((c) => (
            <Link key={c.id} to="/app/cves/$id" params={{ id: c.id }} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 p-3 hover:border-primary/40">
              <span className="font-mono text-xs text-primary">{c.id}</span>
              <SeverityPill severity={c.severity} />
              <span className="line-clamp-1 flex-1 text-sm">{c.title}</span>
              <RiskBadge score={c.riskScore} />
            </Link>
          ))}
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Trending malware">
          <div className="space-y-2">
            {MALWARE.map((m) => (
              <div key={m.id} className="rounded-xl border border-border/60 bg-card/50 p-3">
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm font-semibold">{m.name}</span>
                  <span className="rounded-full border border-border bg-accent/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{m.type}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{m.description}</p>
              </div>
            ))}
          </div>
        </Section>
        <Section title="Trending threat actors">
          <div className="space-y-2">
            {THREAT_ACTORS.map((a) => (
              <div key={a.id} className="rounded-xl border border-border/60 bg-card/50 p-3">
                <div className="flex items-center gap-2">
                  <span className="font-display text-sm font-semibold">{a.name}</span>
                  <span className="rounded-full border border-border bg-accent/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{a.origin}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{a.recentActivity}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {a.aliases.map((al) => <span key={al} className="rounded-full border border-border bg-background/60 px-2 py-0.5 text-[10px] text-muted-foreground">{al}</span>)}
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <Section title="Trending discussions">
        <div className="space-y-2">
          {["Is regreSSHion actually exploitable at scale?", "Best mitigations for Fortinet CVE-2026-4877?", "How is your team handling AI agent supply chain?", "Are LLM firewalls actually useful?"].map((t) => (
            <div key={t} className="rounded-xl border border-border/60 bg-card/50 p-3 text-sm">{t}</div>
          ))}
        </div>
      </Section>

      <Section title="Trending research papers">
        <div className="space-y-2">
          {["Indirect Prompt Injection at Scale — ETH Zurich", "Adversarial ML in EDR Bypass — Black Hat 2026", "State of Software Supply Chain 2026 — Sonatype"].map((t) => (
            <div key={t} className="rounded-xl border border-border/60 bg-card/50 p-3 text-sm">{t}</div>
          ))}
        </div>
      </Section>
    </div>
  );
}