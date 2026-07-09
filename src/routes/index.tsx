import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bell, BookOpen, Bot, Cpu, Filter, Globe2, LineChart, Rss, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Logo } from "@/components/logo";
import { AnimatedBackdrop } from "@/components/animated-bg";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RiskBadge, SeverityPill } from "@/components/risk-badge";
import { ARTICLES } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/60 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Logo />
          <nav className="hidden items-center gap-7 md:flex text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#why" className="hover:text-foreground transition-colors">Why Cyber Brew</a>
            <a href="#screens" className="hover:text-foreground transition-colors">Product</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/auth/login" className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">
              Sign in
            </Link>
            <Link
              to="/auth/register"
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-brand px-3.5 py-1.5 text-sm font-medium text-white shadow-sm ring-glow"
            >
              Start free <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <AnimatedBackdrop />
        <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            AI Daily Cyber Brief · Freshly brewed every morning
          </div>
          <h1 className="mx-auto mt-6 max-w-4xl font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            Freshly brewed <span className="text-gradient-brand">cyber intelligence</span> for every human.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Cyber Brew collects, summarizes, and explains everything happening in cybersecurity — personalized from beginner to CISO,
            with AI risk scoring, a live threat map, and a cyber weather forecast.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link to="/auth/register" className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-3 text-sm font-medium text-white ring-glow transition-transform hover:-translate-y-0.5">
              Start brewing free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/app" className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-5 py-3 text-sm font-medium backdrop-blur hover:border-primary/40">
              Explore the demo
            </Link>
          </div>
          <div className="mt-4 text-xs text-muted-foreground">No credit card · Personalized in 30 seconds</div>

          {/* Hero preview */}
          <div className="relative mx-auto mt-16 max-w-5xl">
            <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-brand opacity-20 blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 shadow-2xl backdrop-blur">
              <div className="flex items-center gap-2 border-b border-border/60 px-4 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                <span className="mx-auto rounded-md border border-border/60 bg-background/60 px-2 py-0.5 text-xs text-muted-foreground">cyberbrew.app</span>
              </div>
              <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3">
                <div className="col-span-1 rounded-xl border border-border/60 bg-gradient-to-br from-rose-500/20 via-orange-500/10 to-transparent p-4 ring-1 ring-rose-400/30">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Cyber Weather</div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-3xl">🔴</span>
                    <span className="font-display text-2xl font-bold text-rose-300">Critical</span>
                  </div>
                  <div className="mt-3 space-y-1 text-xs text-foreground/80">
                    <div>• OpenSSH pre-auth RCE</div>
                    <div>• Active ransomware surge</div>
                    <div>• 3 new CISA KEV entries</div>
                  </div>
                </div>
                {ARTICLES.slice(0, 2).map((a) => (
                  <div key={a.id} className="overflow-hidden rounded-xl border border-border/60 bg-card/60">
                    <div className={`relative h-24 bg-gradient-to-br ${a.thumbnail}`}>
                      <div className="absolute inset-0 bg-dots opacity-30" />
                      <div className="absolute left-2 top-2 flex gap-1.5">
                        <SeverityPill severity={a.severity} />
                      </div>
                      <div className="absolute right-2 top-2"><RiskBadge score={a.riskScore} /></div>
                    </div>
                    <div className="p-3">
                      <div className="line-clamp-2 text-sm font-medium">{a.title}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{a.source} · {a.readingTime} min</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-border/40 bg-card/30 py-6">
        <div className="mx-auto grid max-w-7xl grid-cols-2 items-center gap-6 px-6 text-center text-xs uppercase tracking-widest text-muted-foreground md:grid-cols-6">
          {["NVD", "CISA KEV", "MITRE ATT&CK", "Hacker News", "Vendor Feeds", "OSINT"].map((s) => (
            <div key={s} className="opacity-70">{s}</div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="text-sm font-medium text-primary">Features</div>
          <h2 className="mt-2 font-display text-4xl font-bold tracking-tight">Everything the cyber world, condensed.</h2>
          <p className="mt-3 text-muted-foreground">Personalization, AI summaries, learning mode, threat maps, and a command palette that ties it all together.</p>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Rss, title: "Personalized feed", desc: "Follow topics, vendors, CVEs and threat actors. Your feed adapts to your role." },
            { icon: Sparkles, title: "AI summaries", desc: "30-second, 2-minute and technical deep-dive versions of every article." },
            { icon: BookOpen, title: "Explain for me", desc: "Beginner, Student, Technical, and Executive rewrites — one click." },
            { icon: ShieldCheck, title: "AI Risk Score", desc: "0–10 score per article and CVE, with reasoning you can trust." },
            { icon: Globe2, title: "Live threat map", desc: "See where attacks are happening, right now, by country and industry." },
            { icon: Cpu, title: "Cyber weather", desc: "Calm, Elevated, High or Critical — know the day's threat level at a glance." },
            { icon: Bot, title: "AI assistant", desc: "\"What happened today?\" Chat with an agent that knows your feed." },
            { icon: Filter, title: "CVE explorer", desc: "Powerful filters across CVSS, vendors, KEV, ransomware, and exploitation." },
            { icon: Zap, title: "Command palette", desc: "⌘K to jump anywhere — articles, CVEs, actors, malware." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/50 p-5 backdrop-blur transition-all hover:border-primary/40 hover:-translate-y-0.5">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-white">
                <Icon className="h-5 w-5" />
              </div>
              <div className="mt-4 font-display text-lg font-semibold">{title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why */}
      <section id="why" className="relative overflow-hidden bg-card/30 py-24">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-2">
          <div>
            <div className="text-sm font-medium text-primary">Why Cyber Brew</div>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-tight">Built for humans, not just analysts.</h2>
            <p className="mt-4 text-muted-foreground">
              Cybersecurity news is either impenetrable or clickbait. Cyber Brew re-writes every story for who you are — with citations, learning popups,
              and a scoring system you can defend to leadership.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Save hours a week with AI briefs tuned to your role.",
                "Learning mode turns jargon into knowledge.",
                "Never miss a KEV addition or watchlist update.",
                "Portfolio-worthy design — because premium matters.",
              ].map((x) => (
                <li key={x} className="flex gap-3">
                  <span className="mt-1 grid h-5 w-5 place-items-center rounded-full bg-primary/15 text-primary">
                    <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor"><path d="M8 12.5 4.5 9l-1 1 4.5 4.5L17 6l-1-1z"/></svg>
                  </span>
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            <Link to="/auth/register" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-3 text-sm font-medium text-white ring-glow">
              Create your account <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Bell, kpi: "24/7", label: "Real-time alerts" },
              { icon: LineChart, kpi: "0–10", label: "AI risk scoring" },
              { icon: Globe2, kpi: "180+", label: "Countries mapped" },
              { icon: Sparkles, kpi: "4×", label: "Explain modes" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur">
                <s.icon className="h-5 w-5 text-primary" />
                <div className="mt-3 font-display text-3xl font-bold">{s.kpi}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots placeholder */}
      <section id="screens" className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <div className="text-sm font-medium text-primary">Product</div>
          <h2 className="mt-2 font-display text-4xl font-bold tracking-tight">A workspace that respects your attention.</h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {["Dashboard", "CVE Explorer", "AI Assistant"].map((label, i) => (
            <div key={label} className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/60 bg-card/50">
              <div className={`absolute inset-0 bg-gradient-to-br ${["from-blue-500/25 to-transparent", "from-cyan-500/25 to-transparent", "from-violet-500/25 to-transparent"][i]}`} />
              <div className="absolute inset-0 bg-dots opacity-40" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Preview</div>
                <div className="font-display text-xl font-semibold">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-card/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <div className="text-sm font-medium text-primary">Loved by security teams</div>
            <h2 className="mt-2 font-display text-4xl font-bold tracking-tight">Trusted from SOC to boardroom.</h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { q: "This replaced four browser tabs and a Slack channel. The Executive rewrites go straight to my board deck.", a: "Priya S.", r: "CISO, Fintech" },
              { q: "Learning mode is genuinely magical for new analysts on my team. AI Risk Score is our new triage baseline.", a: "Marco D.", r: "SOC Lead" },
              { q: "The threat map + weather is my first tab every morning. Feels like Linear for cyber news.", a: "Alex R.", r: "Security Researcher" },
            ].map((t) => (
              <figure key={t.a} className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur">
                <blockquote className="text-sm leading-relaxed text-foreground/90">&ldquo;{t.q}&rdquo;</blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-brand text-sm font-semibold text-white">
                    {t.a.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{t.a}</div>
                    <div className="text-xs text-muted-foreground">{t.r}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
        <div className="text-center">
          <div className="text-sm font-medium text-primary">FAQ</div>
          <h2 className="mt-2 font-display text-4xl font-bold tracking-tight">Everything you might ask.</h2>
        </div>
        <Accordion type="single" collapsible className="mt-10">
          {[
            { q: "Where does the intelligence come from?", a: "We aggregate NVD, CISA KEV, MITRE ATT&CK, vendor advisories, Hacker News, Reddit, and curated OSINT feeds. All summaries link to originals." },
            { q: "Is my reading history private?", a: "Yes. Personalization runs on-device where possible, and we never sell or share your interests." },
            { q: "Can beginners really use this?", a: "That's the point. Every article ships with a Beginner rewrite and inline learning popups for jargon." },
            { q: "How is the AI Risk Score calculated?", a: "Severity, active exploitation, industry impact, affected user count, patch availability, and confidence — always shown alongside the score." },
            { q: "Do you offer team plans?", a: "Team shared watchlists, weekly executive digests, and SSO are on the roadmap." },
          ].map((f) => (
            <AccordionItem key={f.q} value={f.q} className="border-border/60">
              <AccordionTrigger className="text-left text-sm font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <AnimatedBackdrop />
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Your <span className="text-gradient-brand">morning brew</span>, freshly poured.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Start with a 30-second onboarding. We'll tailor your dashboard to your role and interests.
          </p>
          <Link to="/auth/register" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-6 py-3 text-sm font-medium text-white ring-glow">
            Start brewing free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <Logo />
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Freshly brewed cyber intelligence for everyone from beginners to CISOs.
              </p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground">Features</a>
              <a href="#why" className="hover:text-foreground">Why</a>
              <a href="#faq" className="hover:text-foreground">FAQ</a>
              <Link to="/auth/login" className="hover:text-foreground">Sign in</Link>
            </div>
          </div>
          <div className="mt-8 border-t border-border/40 pt-6 text-xs text-muted-foreground">
            © 2026 Cyber Brew · Freshly Brewed Cyber Intelligence
          </div>
        </div>
      </footer>
    </div>
  );
}
