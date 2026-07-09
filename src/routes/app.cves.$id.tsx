import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { CVES } from "@/lib/mock-data";
import { RiskBadge, SeverityPill } from "@/components/risk-badge";
import { LearningText } from "@/components/learning-term";
import { ArrowLeft, Bookmark, Sparkles } from "lucide-react";
import { actions, useStore } from "@/lib/store";

export const Route = createFileRoute("/app/cves/$id")({
  component: CvePage,
  loader: ({ params }) => {
    const cve = CVES.find((c) => c.id === params.id);
    if (!cve) throw notFound();
    return { cve };
  },
  head: ({ loaderData }) => ({ meta: [{ title: loaderData ? `${loaderData.cve.id} — Cyber Brew` : "CVE — Cyber Brew" }] }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl py-20 text-center">
      <div className="font-display text-2xl">CVE not found</div>
      <Link to="/app/cves" className="mt-4 inline-block text-primary hover:underline">Back to CVE explorer</Link>
    </div>
  ),
  errorComponent: () => <div className="p-8 text-center text-muted-foreground">Something went wrong.</div>,
});

function CvePage() {
  const { id } = useParams({ from: "/app/cves/$id" });
  const c = CVES.find((x) => x.id === id)!;
  const bookmarked = useStore((s) => s.bookmarkedCves.includes(c.id));

  const props: [string, string][] = [
    ["Vendor", c.vendor],
    ["Product", c.product],
    ["Operating System", c.os.join(", ")],
    ["Attack Vector", c.attackVector],
    ["Authentication", c.authRequired ? "Required" : "None"],
    ["Published", new Date(c.publishedAt).toDateString()],
    ["Updated", new Date(c.updatedAt).toDateString()],
  ];
  const flags: [string, boolean][] = [
    ["Remote Code Execution", c.rce],
    ["Privilege Escalation", c.privEsc],
    ["Denial of Service", c.dos],
    ["Exploited in the Wild", c.exploitedInWild],
    ["CISA KEV", c.cisaKev],
    ["Ransomware Related", c.ransomware],
  ];
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Link to="/app/cves" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to CVE Explorer
      </Link>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm text-primary">{c.id}</span>
          <SeverityPill severity={c.severity} />
          <span className="rounded-md border border-border bg-accent/40 px-2 py-0.5 font-mono text-xs">CVSS {c.cvss.toFixed(1)}</span>
          <RiskBadge score={c.riskScore} size="lg" />
          <button
            onClick={() => actions.toggleCveBookmark(c.id)}
            className={`ml-auto grid h-9 w-9 place-items-center rounded-lg border border-border hover:bg-accent ${bookmarked ? "text-primary" : ""}`}
          >
            <Bookmark className="h-4 w-4" fill={bookmarked ? "currentColor" : "none"} />
          </button>
        </div>
        <h1 className="font-display text-3xl font-bold leading-tight tracking-tight">{c.title}</h1>
        <p className="text-sm leading-relaxed text-muted-foreground"><LearningText text={c.description} /></p>
      </header>

      <section className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> AI Summary & Risk Reasoning
        </div>
        <p className="mt-3 text-sm leading-relaxed text-foreground/90">
          Risk {c.riskScore.toFixed(1)}/10 assigned because {c.cvss >= 9 ? "CVSS is critical" : "CVSS is elevated"}
          {c.exploitedInWild ? ", it is actively exploited in the wild" : ""}
          {c.cisaKev ? ", and CISA has added it to the KEV catalog" : ""}
          {c.ransomware ? ", with ransomware crews known to weaponize it" : ""}. Patch availability and industry impact are also factored in.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card/50 p-4">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Properties</div>
          <dl className="mt-3 divide-y divide-border/60 text-sm">
            {props.map(([k, v]) => (
              <div key={k} className="flex justify-between py-2">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card/50 p-4">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Impact flags</div>
          <ul className="mt-3 space-y-2 text-sm">
            {flags.map(([k, v]) => (
              <li key={k} className="flex items-center justify-between">
                <span>{k}</span>
                <span className={v ? "rounded-md bg-rose-500/15 px-2 py-0.5 text-xs font-medium text-rose-300" : "rounded-md bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-300"}>
                  {v ? "Yes" : "No"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}