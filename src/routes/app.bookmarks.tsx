import { createFileRoute, Link } from "@tanstack/react-router";
import { ARTICLES, CVES } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { NewsCard } from "@/components/news-card";
import { RiskBadge, SeverityPill } from "@/components/risk-badge";
import { Bookmark } from "lucide-react";

export const Route = createFileRoute("/app/bookmarks")({
  component: BookmarksPage,
  head: () => ({ meta: [{ title: "Bookmarks — Cyber Brew" }] }),
});

function BookmarksPage() {
  const bookmarks = useStore((s) => s.bookmarks);
  const cveBookmarks = useStore((s) => s.bookmarkedCves);
  const savedArticles = ARTICLES.filter((a) => bookmarks.includes(a.id));
  const savedCves = CVES.filter((c) => cveBookmarks.includes(c.id));

  return (
    <div className="mx-auto max-w-7xl space-y-10">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Bookmarks</h1>
        <p className="mt-1 text-muted-foreground">Your saved articles, CVEs, advisories and research.</p>
      </div>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold">Saved articles</h2>
        {savedArticles.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedArticles.map((a) => <NewsCard key={a.id} article={a} />)}
          </div>
        ) : (
          <EmptyState label="No saved articles yet" />
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-lg font-semibold">Saved CVEs</h2>
        {savedCves.length ? (
          <div className="grid gap-2 md:grid-cols-2">
            {savedCves.map((c) => (
              <Link key={c.id} to="/app/cves/$id" params={{ id: c.id }} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 p-3 hover:border-primary/40">
                <span className="font-mono text-xs text-primary">{c.id}</span>
                <SeverityPill severity={c.severity} />
                <span className="line-clamp-1 flex-1 text-sm">{c.title}</span>
                <RiskBadge score={c.riskScore} />
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState label="No saved CVEs yet" />
        )}
      </section>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border/70 bg-card/30 p-10 text-center">
      <Bookmark className="mx-auto h-6 w-6 text-muted-foreground" />
      <div className="mt-2 text-sm font-medium">{label}</div>
      <p className="mt-1 text-xs text-muted-foreground">Tap the bookmark icon anywhere in the app to save.</p>
    </div>
  );
}