import { createFileRoute, Link } from "@tanstack/react-router";
import { ARTICLES, CVES, THREAT_EVENTS, severityColor } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { NewsCard } from "@/components/news-card";
import { WeatherCard } from "@/components/weather-card";
import { Section } from "@/components/section";
import { WorldMap } from "@/components/world-map";
import { RiskBadge, SeverityPill } from "@/components/risk-badge";
import { AlertTriangle, ArrowRight, BookOpen, MessageSquare, Sparkles, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard — Cyber Brew" }] }),
});

function Dashboard() {
  const name = useStore((s) => s.name) || "there";
  const follows = useStore((s) => s.follows);
  const bookmarks = useStore((s) => s.bookmarks);
  const reading = useStore((s) => s.reading);
  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 18 ? "Good afternoon" : "Good evening";

  const personalized = follows.length
    ? ARTICLES.filter((a) => a.tags.some((t) => follows.includes(t)) || follows.includes(a.category))
    : ARTICLES;
  const trending = [...ARTICLES].sort((a, b) => b.riskScore - a.riskScore).slice(0, 3);
  const critical = CVES.filter((c) => c.severity === "critical").slice(0, 3);
  const savedArticles = ARTICLES.filter((a) => bookmarks.includes(a.id));
  const continueReading = reading.map((id) => ARTICLES.find((a) => a.id === id)).filter(Boolean).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl space-y-10">
      {/* Greeting */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-sm text-muted-foreground">{greeting},</div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            {name}. <span className="text-gradient-brand">Freshly brewed.</span>
          </h1>
        </div>
        <Link to="/app/assistant" className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-3.5 py-2 text-sm backdrop-blur hover:border-primary/40">
          <Sparkles className="h-4 w-4 text-primary" /> Ask AI: What happened today?
        </Link>
      </div>

      {/* Weather + Daily brief */}
      <div className="grid gap-4 lg:grid-cols-3">
        <WeatherCard />
        <div className="lg:col-span-2 rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> AI Daily Cyber Brief
          </div>
          <h2 className="mt-2 font-display text-xl font-semibold leading-snug">
            The dominant story today is <span className="text-gradient-brand">regreSSHion</span> — an unauthenticated RCE in OpenSSH threatening most Linux servers.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Combined with 3 new CISA KEV additions (Fortinet, VMware, Ivanti), active LockBit 4.0 activity in healthcare, and a hijacked GitHub Action leaking secrets — today's operational priorities are patching internet-facing appliances, rotating CI/CD secrets, and validating offline backups.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["OpenSSH", "CISA KEV", "Ransomware", "Supply Chain"].map((t) => (
              <span key={t} className="rounded-full border border-border bg-accent/50 px-2 py-0.5 text-xs">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Latest news + right column */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Section title="Latest cyber news" subtitle={follows.length ? "Personalized for your interests" : "Fresh today"} href="/app/news">
            <div className="grid gap-4 sm:grid-cols-2">
              {personalized.slice(0, 4).map((a) => <NewsCard key={a.id} article={a} />)}
            </div>
          </Section>

          <Section title="Interactive threat map" subtitle="Live incidents worldwide" href="/app/threats">
            <WorldMap />
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Trending" href="/app/trending">
            <div className="space-y-2">
              {trending.map((a, i) => (
                <Link key={a.id} to="/app/news/$id" params={{ id: a.slug }} className="group flex gap-3 rounded-xl border border-border/60 bg-card/50 p-3 hover:border-primary/40">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-brand font-mono text-sm font-semibold text-white">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-2 text-sm font-medium group-hover:text-primary transition-colors">{a.title}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <SeverityPill severity={a.severity} /> <RiskBadge score={a.riskScore} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Section>

          <Section title="Critical CVEs" href="/app/cves">
            <div className="space-y-2">
              {critical.map((c) => (
                <Link key={c.id} to="/app/cves/$id" params={{ id: c.id }} className="block rounded-xl border border-border/60 bg-card/50 p-3 hover:border-primary/40">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-primary">{c.id}</span>
                    <SeverityPill severity={c.severity} />
                    <RiskBadge score={c.riskScore} />
                  </div>
                  <div className="mt-1.5 line-clamp-2 text-sm">{c.title}</div>
                </Link>
              ))}
            </div>
          </Section>

          <Section title="AI risk alerts">
            <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0 text-rose-300" />
                <div>
                  <div className="text-sm font-medium text-rose-200">3 items match your watchlist at Critical severity</div>
                  <p className="mt-1 text-xs text-rose-200/80">OpenSSH, FortiOS, and vCenter — all being exploited.</p>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </div>

      {/* Live incidents */}
      <Section title="Live incidents" subtitle="Recent activity from the threat map">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {THREAT_EVENTS.slice(0, 6).map((e) => (
            <div key={e.id} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 p-3">
              <span className={`inline-flex h-2 w-2 rounded-full ${severityColor(e.severity).split(" ")[0].replace("text-", "bg-")}`} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{e.title}</div>
                <div className="text-xs text-muted-foreground">{e.country} · {e.industry} · {e.time}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Continue reading */}
      {continueReading.length > 0 && (
        <Section title="Continue reading">
          <div className="grid gap-4 sm:grid-cols-3">
            {continueReading.map((a) => a && <NewsCard key={a.id} article={a} compact />)}
          </div>
        </Section>
      )}

      {/* Saved */}
      {savedArticles.length > 0 ? (
        <Section title="Saved articles" href="/app/bookmarks">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedArticles.slice(0, 3).map((a) => <NewsCard key={a.id} article={a} compact />)}
          </div>
        </Section>
      ) : (
        <Section title="Saved articles">
          <div className="rounded-2xl border border-dashed border-border/70 bg-card/30 p-8 text-center">
            <BookOpen className="mx-auto h-6 w-6 text-muted-foreground" />
            <div className="mt-2 text-sm font-medium">Nothing saved yet</div>
            <p className="mt-1 text-xs text-muted-foreground">Bookmark articles from the feed to keep them here.</p>
          </div>
        </Section>
      )}

      {/* Discussions / research */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Trending discussions">
          <div className="space-y-2">
            {["Is regreSSHion actually exploitable at scale?", "Best mitigations for Fortinet CVE-2026-4877?", "How is your team handling AI agent supply chain?"].map((t) => (
              <div key={t} className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/50 p-3">
                <MessageSquare className="mt-0.5 h-4 w-4 text-primary" />
                <div className="text-sm">{t}</div>
              </div>
            ))}
          </div>
        </Section>
        <Section title="Recently published research">
          <div className="space-y-2">
            {["Indirect prompt injection at scale (ETH Zurich)", "Adversarial ML in EDR bypass (Black Hat 2026)", "State of software supply chain 2026 (Sonatype)"].map((t) => (
              <div key={t} className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/50 p-3">
                <TrendingUp className="mt-0.5 h-4 w-4 text-primary" />
                <div className="text-sm">{t}</div>
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}