import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ARTICLES } from "@/lib/mock-data";
import { LearningText } from "@/components/learning-term";
import { RiskBadge, SeverityPill } from "@/components/risk-badge";
import { ArrowLeft, Bookmark, Clock, ExternalLink, Heart, Share2, Sparkles, GraduationCap, Briefcase, Baby, Terminal } from "lucide-react";
import { actions, useStore } from "@/lib/store";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/app/news/$id")({
  component: ArticlePage,
  loader: ({ params }) => {
    const article = ARTICLES.find((a) => a.slug === params.id);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData ? `${loaderData.article.title} — Cyber Brew` : "Article — Cyber Brew" }],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl py-20 text-center">
      <div className="font-display text-2xl">Article not found</div>
      <Link to="/app/news" className="mt-4 inline-block text-primary hover:underline">Back to news</Link>
    </div>
  ),
  errorComponent: () => <div className="p-8 text-center text-muted-foreground">Something went wrong.</div>,
});

type SummaryTab = "30s" | "2min" | "deep";
type Explain = "beginner" | "student" | "technical" | "executive";

function ArticlePage() {
  const { id } = useParams({ from: "/app/news/$id" });
  const article = ARTICLES.find((a) => a.slug === id)!;
  const [tab, setTab] = useState<SummaryTab>("30s");
  const [explain, setExplain] = useState<Explain>("student");
  const bookmarked = useStore((s) => s.bookmarks.includes(article.id));
  const liked = useStore((s) => s.liked.includes(article.id));

  const summaryText = tab === "30s" ? article.summary30s : tab === "2min" ? article.summary2min : article.technicalDeepDive;
  const explainText = explainForRole(article, explain);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Link to="/app/news" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to news
      </Link>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <SeverityPill severity={article.severity} />
          <span className="rounded-full border border-border bg-accent/50 px-2 py-0.5 text-xs">{article.category}</span>
          <RiskBadge score={article.riskScore} size="lg" />
        </div>
        <h1 className="font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl">
          <LearningText text={article.title} />
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{article.readingTime} min read</span>
          <span>·</span>
          <span>{article.source}</span>
          <span>·</span>
          <span>{formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}</span>
          <div className="ml-auto flex items-center gap-1">
            <button onClick={() => { actions.toggleBookmark(article.id); toast.success(bookmarked ? "Removed" : "Bookmarked"); }} className={`grid h-9 w-9 place-items-center rounded-lg border border-border hover:bg-accent ${bookmarked ? "text-primary" : ""}`}>
              <Bookmark className="h-4 w-4" fill={bookmarked ? "currentColor" : "none"} />
            </button>
            <button onClick={() => actions.toggleLike(article.id)} className={`grid h-9 w-9 place-items-center rounded-lg border border-border hover:bg-accent ${liked ? "text-rose-400" : ""}`}>
              <Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} />
            </button>
            <button onClick={() => toast.success("Link copied")} className="grid h-9 w-9 place-items-center rounded-lg border border-border hover:bg-accent">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className={`relative h-56 overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br ${article.thumbnail}`}>
          <div className="absolute inset-0 bg-dots opacity-30" />
        </div>
      </header>

      {/* AI Summary */}
      <section className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> AI Summary
        </div>
        <div className="mt-3 inline-flex rounded-xl border border-border bg-background/60 p-1 text-xs">
          {[
            { id: "30s", label: "30 sec" },
            { id: "2min", label: "2 min" },
            { id: "deep", label: "Technical deep-dive" },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id as SummaryTab)} className={`rounded-lg px-3 py-1.5 transition-colors ${tab === t.id ? "bg-gradient-brand text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              {t.label}
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-foreground/90">
          <LearningText text={summaryText} />
        </p>
      </section>

      {/* Explain for me */}
      <section className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Explain this for me
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "beginner", label: "Beginner", icon: Baby },
              { id: "student", label: "Student", icon: GraduationCap },
              { id: "technical", label: "Technical", icon: Terminal },
              { id: "executive", label: "Executive", icon: Briefcase },
            ].map((e) => {
              const Icon = e.icon;
              const active = explain === e.id;
              return (
                <button key={e.id} onClick={() => setExplain(e.id as Explain)} className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition-colors ${active ? "border-primary bg-primary/15 text-foreground" : "border-border bg-background/60 text-muted-foreground hover:text-foreground"}`}>
                  <Icon className="h-3.5 w-3.5" /> {e.label}
                </button>
              );
            })}
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-foreground/90">
          <LearningText text={explainText} />
        </p>
      </section>

      {/* Structured briefing */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="What happened">{article.body}</Card>
        <Card title="Why it matters">{article.whyItMatters}</Card>
        <Card title="Who is affected">{article.whoIsAffected}</Card>
        <Card title="Recommended actions">
          <ul className="space-y-1.5">
            {article.recommendedActions.map((a) => (
              <li key={a} className="flex gap-2"><span className="mt-1.5 h-1 w-1 rounded-full bg-primary" />{a}</li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Sources */}
      <section>
        <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">Original sources</h3>
        <div className="mt-3 space-y-2">
          {article.originalSources.map((s) => (
            <a key={s.url} href={s.url} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl border border-border/60 bg-card/50 px-4 py-3 text-sm hover:border-primary/40">
              <span>{s.label}</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/50 p-4">
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</div>
      <div className="mt-2 text-sm leading-relaxed text-foreground/90">{children}</div>
    </div>
  );
}

function explainForRole(a: (typeof ARTICLES)[number], mode: Explain) {
  if (mode === "beginner") {
    return `Imagine ${a.title.toLowerCase()}. In plain words: something important in the digital world has a problem that bad actors can use. ${a.whyItMatters} You don't have to do anything technical — just keep your devices updated.`;
  }
  if (mode === "student") {
    return `${a.summary2min} Study angle: map this to the MITRE ATT&CK phase, identify the underlying weakness class (buffer overflow, deserialization, misconfig), and think about what a detection engineer would write to catch it.`;
  }
  if (mode === "technical") {
    return `${a.technicalDeepDive} Detection: hunt for the IOCs listed by CISA, add YARA rules for the loader, and validate patch levels via osquery. Mitigation checklist: ${a.recommendedActions.join("; ")}.`;
  }
  return `Business impact: ${a.whyItMatters} Exposure scope: ${a.whoIsAffected} Recommended board-level action: fund an emergency patch cycle for internet-facing assets and confirm cyber insurance covers active exploitation.`;
}