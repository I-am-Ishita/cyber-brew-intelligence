import { useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LEARNING_TERMS } from "@/lib/mock-data";
import { BookOpen, Sparkles } from "lucide-react";

export function LearningTerm({ term, children }: { term: string; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const data = LEARNING_TERMS[term];
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="underline decoration-primary/50 decoration-dotted underline-offset-4 hover:text-primary transition-colors"
      >
        {children ?? term}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-xl">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand text-white">
                <BookOpen className="h-4 w-4" />
              </span>
              {data?.title ?? term}
            </DialogTitle>
          </DialogHeader>
          {data ? (
            <div className="space-y-4 text-sm">
              <p className="leading-relaxed text-foreground/90">{data.simple}</p>
              <div className="rounded-xl border border-border/60 bg-card/50 p-4">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <Sparkles className="h-3 w-3" /> Real-world example
                </div>
                <p className="mt-1 leading-relaxed">{data.example}</p>
              </div>
              <div>
                <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Diagram</div>
                <div className="grid h-32 place-items-center rounded-xl border border-dashed border-border/70 bg-card/40 text-xs text-muted-foreground">
                  Visual diagram placeholder
                </div>
              </div>
              <div>
                <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Related terms</div>
                <div className="flex flex-wrap gap-2">
                  {data.related.map((r) => (
                    <span key={r} className="rounded-full border border-border bg-accent/50 px-2 py-0.5 text-xs">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Learning content coming soon.</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export function LearningText({ text }: { text: string }) {
  const terms = Object.keys(LEARNING_TERMS).sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
  const parts = text.split(pattern);
  return (
    <span>
      {parts.map((p, i) =>
        LEARNING_TERMS[p] ? <LearningTerm key={i} term={p} /> : <span key={i}>{p}</span>,
      )}
    </span>
  );
}