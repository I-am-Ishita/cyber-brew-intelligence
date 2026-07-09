import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CVES, riskColor } from "@/lib/mock-data";
import { RiskBadge, SeverityPill } from "@/components/risk-badge";
import { actions, useStore } from "@/lib/store";
import { Bookmark, Filter, Search } from "lucide-react";

export const Route = createFileRoute("/app/cves")({
  component: CvesPage,
  head: () => ({ meta: [{ title: "CVE Explorer — Cyber Brew" }] }),
});

function CvesPage() {
  const [q, setQ] = useState("");
  const [minCvss, setMinCvss] = useState(0);
  const [vendor, setVendor] = useState("All");
  const [severity, setSeverity] = useState("All");
  const [flags, setFlags] = useState({ kev: false, wild: false, rce: false, priv: false, dos: false, ransomware: false, noAuth: false });
  const [sort, setSort] = useState<"risk" | "cvss" | "date">("risk");
  const bookmarked = useStore((s) => s.bookmarkedCves);

  const vendors = useMemo(() => ["All", ...Array.from(new Set(CVES.map((c) => c.vendor)))], []);
  const filtered = useMemo(() => {
    let list = CVES.filter((c) =>
      (q ? (c.id + " " + c.title + " " + c.vendor + " " + c.product).toLowerCase().includes(q.toLowerCase()) : true) &&
      c.cvss >= minCvss &&
      (vendor === "All" || c.vendor === vendor) &&
      (severity === "All" || c.severity === severity) &&
      (!flags.kev || c.cisaKev) &&
      (!flags.wild || c.exploitedInWild) &&
      (!flags.rce || c.rce) &&
      (!flags.priv || c.privEsc) &&
      (!flags.dos || c.dos) &&
      (!flags.ransomware || c.ransomware) &&
      (!flags.noAuth || !c.authRequired)
    );
    if (sort === "risk") list = list.sort((a, b) => b.riskScore - a.riskScore);
    if (sort === "cvss") list = list.sort((a, b) => b.cvss - a.cvss);
    if (sort === "date") list = list.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
    return list;
  }, [q, minCvss, vendor, severity, flags, sort]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">CVE Explorer</h1>
          <p className="mt-1 text-muted-foreground">Search, filter and triage vulnerabilities with AI risk scoring.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Sort</span>
          {(["risk", "cvss", "date"] as const).map((s) => (
            <button key={s} onClick={() => setSort(s)} className={`rounded-lg border px-2 py-1 ${sort === s ? "border-primary bg-primary/15 text-foreground" : "border-border bg-card/50 hover:text-foreground"}`}>
              {s === "risk" ? "AI Risk" : s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="grid gap-4 rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur lg:grid-cols-4">
        <label className="lg:col-span-2 block">
          <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><Search className="h-3 w-3" /> Search</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="CVE-ID, vendor, product…" className="w-full rounded-xl border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Vendor</span>
          <select value={vendor} onChange={(e) => setVendor(e.target.value)} className="w-full rounded-xl border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary">
            {vendors.map((v) => <option key={v}>{v}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">Severity</span>
          <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="w-full rounded-xl border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary">
            {["All", "critical", "high", "medium", "low"].map((v) => <option key={v}>{v}</option>)}
          </select>
        </label>
        <label className="lg:col-span-2 block">
          <span className="mb-1.5 flex items-center justify-between text-xs font-medium text-muted-foreground"><span>Min CVSS</span><span className="font-mono">{minCvss.toFixed(1)}</span></span>
          <input type="range" min={0} max={10} step={0.1} value={minCvss} onChange={(e) => setMinCvss(+e.target.value)} className="w-full accent-primary" />
        </label>
        <div className="lg:col-span-2">
          <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><Filter className="h-3 w-3" /> Flags</span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { k: "kev", l: "CISA KEV" },
              { k: "wild", l: "Exploited in Wild" },
              { k: "rce", l: "RCE" },
              { k: "priv", l: "Priv-Esc" },
              { k: "dos", l: "DoS" },
              { k: "ransomware", l: "Ransomware" },
              { k: "noAuth", l: "No Auth" },
            ].map((f) => {
              const active = flags[f.k as keyof typeof flags];
              return (
                <button key={f.k} onClick={() => setFlags({ ...flags, [f.k]: !active })} className={`rounded-full border px-2.5 py-1 text-xs ${active ? "border-primary bg-primary/15 text-foreground" : "border-border bg-background/60 text-muted-foreground hover:text-foreground"}`}>
                  {f.l}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/50">
        <div className="grid grid-cols-12 gap-3 border-b border-border/60 bg-card/70 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <div className="col-span-3">CVE</div>
          <div className="col-span-4">Title</div>
          <div className="col-span-2">Vendor</div>
          <div className="col-span-1">CVSS</div>
          <div className="col-span-1">AI Risk</div>
          <div className="col-span-1 text-right">Flags</div>
        </div>
        {filtered.map((c) => (
          <Link
            key={c.id}
            to="/app/cves/$id"
            params={{ id: c.id }}
            className="grid grid-cols-12 items-center gap-3 border-b border-border/40 px-4 py-3 text-sm transition-colors last:border-0 hover:bg-accent/40"
          >
            <div className="col-span-3 flex items-center gap-2">
              <span className="font-mono text-xs text-primary">{c.id}</span>
              <SeverityPill severity={c.severity} />
            </div>
            <div className="col-span-4 truncate">{c.title}</div>
            <div className="col-span-2 truncate text-muted-foreground">{c.vendor} · {c.product}</div>
            <div className="col-span-1 font-mono">{c.cvss.toFixed(1)}</div>
            <div className="col-span-1"><span className={`inline-block rounded-md border px-1.5 py-0.5 font-mono text-xs ${riskColor(c.riskScore)}`}>{c.riskScore.toFixed(1)}</span></div>
            <div className="col-span-1 flex items-center justify-end gap-1">
              {c.cisaKev && <span title="KEV" className="rounded bg-rose-500/20 px-1 py-0.5 text-[9px] text-rose-300">KEV</span>}
              {c.exploitedInWild && <span title="Exploited in Wild" className="rounded bg-orange-500/20 px-1 py-0.5 text-[9px] text-orange-300">ITW</span>}
              <button
                onClick={(e) => { e.preventDefault(); actions.toggleCveBookmark(c.id); }}
                className={`ml-1 grid h-6 w-6 place-items-center rounded ${bookmarked.includes(c.id) ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Bookmark className="h-3.5 w-3.5" fill={bookmarked.includes(c.id) ? "currentColor" : "none"} />
              </button>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="p-10 text-center text-sm text-muted-foreground">No CVEs match those filters.</div>
        )}
      </div>
    </div>
  );
}