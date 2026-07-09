import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { ARTICLES, CVES, MALWARE, THREAT_ACTORS, FOLLOW_CATALOG } from "@/lib/mock-data";
import { RiskBadge, SeverityPill } from "@/components/risk-badge";
import { Search } from "lucide-react";

export const Route = createFileRoute("/app/search")({
  component: SearchPage,
  validateSearch: z.object({ q: z.string().optional() }),
  head: () => ({ meta: [{ title: "Search — Cyber Brew" }] }),
});

function SearchPage() {
  const { q: initialQ } = Route.useSearch();
  const [q, setQ] = useState(initialQ ?? "");
  const query = q.trim().toLowerCase();

  const articles = query ? ARTICLES.filter((a) => (a.title + " " + a.excerpt + " " + a.tags.join(" ")).toLowerCase().includes(query)) : [];
  const cves = query ? CVES.filter((c) => (c.id + " " + c.title + " " + c.vendor + " " + c.product).toLowerCase().includes(query)) : [];
  const actors = query ? THREAT_ACTORS.filter((a) => (a.name + " " + a.aliases.join(" ")).toLowerCase().includes(query)) : [];
  const malware = query ? MALWARE.filter((m) => m.name.toLowerCase().includes(query)) : [];
  const entities = query
    ? Object.entries(FOLLOW_CATALOG).flatMap(([g, items]) => items.filter((i) => i.toLowerCase().includes(query)).map((i) => ({ group: g, item: i })))
    : [];

  const totalHits = articles.length + cves.length + actors.length + malware.length + entities.length;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Global search</h1>
        <p className="mt-1 text-sm text-muted-foreground">Articles, CVEs, malware, actors, vendors and technologies — all in one place.</p>
      </div>
      <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card/60 px-4 py-3 backdrop-blur">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search anything…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        {q && <span className="text-xs text-muted-foreground">{totalHits} result{totalHits === 1 ? "" : "s"}</span>}
      </div>

      {query ? (
        totalHits === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/70 bg-card/30 p-10 text-center text-sm text-muted-foreground">Nothing matches "{q}".</div>
        ) : (
          <div className="space-y-6">
            {articles.length > 0 && (
              <Group title="Articles">
                {articles.map((a) => (
                  <Link key={a.id} to="/app/news/$id" params={{ id: a.slug }} className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/50 p-3 hover:border-primary/40">
                    <SeverityPill severity={a.severity} />
                    <div className="min-w-0 flex-1">
                      <div className="line-clamp-1 text-sm font-medium">{a.title}</div>
                      <div className="line-clamp-1 text-xs text-muted-foreground">{a.excerpt}</div>
                    </div>
                    <RiskBadge score={a.riskScore} />
                  </Link>
                ))}
              </Group>
            )}
            {cves.length > 0 && (
              <Group title="CVEs">
                {cves.map((c) => (
                  <Link key={c.id} to="/app/cves/$id" params={{ id: c.id }} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 p-3 hover:border-primary/40">
                    <span className="font-mono text-xs text-primary">{c.id}</span>
                    <span className="line-clamp-1 flex-1 text-sm">{c.title}</span>
                    <RiskBadge score={c.riskScore} />
                  </Link>
                ))}
              </Group>
            )}
            {actors.length > 0 && (
              <Group title="Threat actors">
                {actors.map((a) => (
                  <div key={a.id} className="rounded-xl border border-border/60 bg-card/50 p-3 text-sm">
                    <div className="font-medium">{a.name} <span className="text-xs text-muted-foreground">· {a.origin}</span></div>
                    <div className="text-xs text-muted-foreground">{a.recentActivity}</div>
                  </div>
                ))}
              </Group>
            )}
            {malware.length > 0 && (
              <Group title="Malware">
                {malware.map((m) => (
                  <div key={m.id} className="rounded-xl border border-border/60 bg-card/50 p-3 text-sm">
                    <div className="font-medium">{m.name} <span className="text-xs text-muted-foreground">· {m.type}</span></div>
                    <div className="text-xs text-muted-foreground">{m.description}</div>
                  </div>
                ))}
              </Group>
            )}
            {entities.length > 0 && (
              <Group title="Entities">
                <div className="flex flex-wrap gap-2">
                  {entities.map((e) => (
                    <span key={e.group + e.item} className="rounded-full border border-border bg-accent/40 px-2 py-0.5 text-xs">
                      {e.item} <span className="text-muted-foreground">· {e.group}</span>
                    </span>
                  ))}
                </div>
              </Group>
            )}
          </div>
        )
      ) : (
        <div className="rounded-2xl border border-dashed border-border/70 bg-card/30 p-10 text-center text-sm text-muted-foreground">
          Try "OpenSSH", "LockBit", "CVE-2026", "healthcare"…
        </div>
      )}
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}