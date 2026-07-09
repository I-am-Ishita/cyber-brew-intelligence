import { Link } from "@tanstack/react-router";
import { Bookmark, Clock, ExternalLink, Heart, Share2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Article } from "@/lib/mock-data";
import { RiskBadge, SeverityPill } from "./risk-badge";
import { actions, useStore } from "@/lib/store";
import { toast } from "sonner";

export function NewsCard({ article, compact = false }: { article: Article; compact?: boolean }) {
  const bookmarked = useStore((s) => s.bookmarks.includes(article.id));
  const liked = useStore((s) => s.liked.includes(article.id));

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur transition-all hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-2xl">
      <Link
        to="/app/news/$id"
        params={{ id: article.slug }}
        className="block"
        onClick={() => actions.addReading(article.id)}
      >
        <div className={`relative ${compact ? "h-28" : "h-40"} overflow-hidden`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${article.thumbnail}`} />
          <div className="absolute inset-0 bg-dots opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            <SeverityPill severity={article.severity} />
            <span className="rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur">
              {article.category}
            </span>
          </div>
          <div className="absolute right-3 top-3">
            <RiskBadge score={article.riskScore} />
          </div>
        </div>
        <div className="space-y-2 p-4">
          <h3 className="font-display text-[15px] font-semibold leading-snug tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
          {!compact && (
            <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
          )}
          <div className="flex items-center gap-3 pt-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" /> {article.readingTime} min
            </span>
            <span>·</span>
            <span className="truncate">{article.source}</span>
            <span>·</span>
            <span className="whitespace-nowrap">{formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}</span>
          </div>
        </div>
      </Link>
      <div className="flex items-center justify-between border-t border-border/60 px-4 py-2">
        <div className="flex items-center gap-1">
          <button
            aria-label="Bookmark"
            onClick={(e) => { e.preventDefault(); actions.toggleBookmark(article.id); toast.success(bookmarked ? "Removed" : "Bookmarked"); }}
            className={`grid h-8 w-8 place-items-center rounded-lg transition-colors hover:bg-accent ${bookmarked ? "text-primary" : "text-muted-foreground"}`}
          >
            <Bookmark className="h-4 w-4" fill={bookmarked ? "currentColor" : "none"} />
          </button>
          <button
            aria-label="Like"
            onClick={(e) => { e.preventDefault(); actions.toggleLike(article.id); }}
            className={`grid h-8 w-8 place-items-center rounded-lg transition-colors hover:bg-accent ${liked ? "text-rose-400" : "text-muted-foreground"}`}
          >
            <Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} />
          </button>
          <button
            aria-label="Share"
            onClick={(e) => { e.preventDefault(); toast.success("Link copied"); }}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
        <a href={article.sourceUrl} onClick={(e) => e.stopPropagation()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          Source <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </article>
  );
}