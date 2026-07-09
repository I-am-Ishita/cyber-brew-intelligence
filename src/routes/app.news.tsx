import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ARTICLES } from "@/lib/mock-data";
import { NewsCard } from "@/components/news-card";

export const Route = createFileRoute("/app/news")({
  component: NewsPage,
  head: () => ({ meta: [{ title: "Cyber News — Cyber Brew" }] }),
});

const CATEGORIES = ["All", "Zero Days", "Ransomware", "AI Security", "Privacy", "Threat Intelligence", "Supply Chain", "Cyber News"];

function NewsPage() {
  const [cat, setCat] = useState("All");
  const filtered = cat === "All" ? ARTICLES : ARTICLES.filter((a) => a.category === cat);
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Cyber News</h1>
        <p className="mt-1 text-muted-foreground">Fresh from every corner of the industry, with AI summaries.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
              cat === c ? "border-primary bg-primary/15 text-foreground" : "border-border/60 bg-card/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a) => <NewsCard key={a.id} article={a} />)}
      </div>
    </div>
  );
}