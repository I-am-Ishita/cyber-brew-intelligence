import { createFileRoute } from "@tanstack/react-router";
import { ARTICLES, FOLLOW_CATALOG, ROLES } from "@/lib/mock-data";
import { actions, useStore, type UserState } from "@/lib/store";
import { Check, User } from "lucide-react";

export const Route = createFileRoute("/app/profile")({
  component: ProfilePage,
  head: () => ({ meta: [{ title: "Profile — Cyber Brew" }] }),
});

function ProfilePage() {
  const s = useStore((x) => x);
  const role = ROLES.find((r) => r.id === s.role);
  const historyArticles = s.history.map((id) => ARTICLES.find((a) => a.id === id)).filter(Boolean);
  const notif = s.notifications;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-brand text-2xl font-semibold text-white ring-glow">
          {s.name?.charAt(0).toUpperCase() || <User className="h-7 w-7" />}
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">{s.name || "Analyst"}</h1>
          <p className="text-sm text-muted-foreground">{s.email || "you@company.com"} · {role?.label ?? "No role selected"}</p>
        </div>
      </div>

      <section className="rounded-2xl border border-border/60 bg-card/60 p-5">
        <h2 className="font-display text-lg font-semibold">Notification preferences</h2>
        <p className="mt-1 text-sm text-muted-foreground">Choose what you want to be alerted about.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {(
            [
              ["breaking", "Breaking news"],
              ["dailyBrief", "Daily cyber brief"],
              ["criticalCves", "Critical CVEs"],
              ["watchlist", "Watchlist updates"],
              ["weather", "Cyber weather"],
              ["topics", "Followed topics"],
              ["breaches", "Major data breaches"],
            ] as [keyof UserState["notifications"], string][]
          ).map(([k, label]) => {
            const active = notif[k];
            return (
              <button key={k} onClick={() => actions.toggleNotification(k)} className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition-colors ${active ? "border-primary bg-primary/10" : "border-border bg-card/40 hover:border-primary/40"}`}>
                <span>{label}</span>
                <span className={`inline-flex h-5 w-9 items-center rounded-full transition-colors ${active ? "bg-primary" : "bg-border"}`}>
                  <span className={`h-4 w-4 rounded-full bg-white transition-transform ${active ? "translate-x-4" : "translate-x-0.5"}`} />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-card/60 p-5">
        <h2 className="font-display text-lg font-semibold">Followed</h2>
        <p className="mt-1 text-sm text-muted-foreground">Add or remove interests — your feed updates instantly.</p>
        <div className="mt-4 space-y-5">
          {Object.entries(FOLLOW_CATALOG).map(([group, items]) => (
            <div key={group}>
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">{group.replace(/([A-Z])/g, " $1").trim()}</div>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => {
                  const active = s.follows.includes(item);
                  return (
                    <button key={item} onClick={() => actions.toggleFollow(item)} className={`rounded-full border px-3 py-1 text-xs transition-colors ${active ? "border-primary bg-primary/15 text-foreground" : "border-border bg-card/40 text-muted-foreground hover:text-foreground hover:border-primary/40"}`}>
                      {active && <Check className="mr-1 inline h-3 w-3" />}{item}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-card/60 p-5">
        <h2 className="font-display text-lg font-semibold">Reading history</h2>
        <ul className="mt-3 divide-y divide-border/50">
          {historyArticles.length === 0 && <li className="py-6 text-center text-sm text-muted-foreground">Nothing yet.</li>}
          {historyArticles.map((a) => a && (
            <li key={a.id} className="py-2.5 text-sm">
              <div className="font-medium">{a.title}</div>
              <div className="text-xs text-muted-foreground">{a.source} · {a.category}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}