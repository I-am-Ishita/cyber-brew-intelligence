import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ARTICLES, CVES, todaysWeather } from "@/lib/mock-data";
import { Send, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/assistant")({
  component: Assistant,
  head: () => ({ meta: [{ title: "AI Assistant — Cyber Brew" }] }),
});

type Msg = { role: "user" | "assistant"; content: string };

const PROMPTS = [
  "What happened today?",
  "What happened while I was away?",
  "Summarize today's cyber news.",
  "Explain CVE-2026-6387.",
  "What attacks target healthcare?",
  "What are today's biggest threats?",
];

function respond(q: string): string {
  const l = q.toLowerCase();
  if (l.includes("today") || l.includes("summar")) {
    const w = todaysWeather();
    const top = [...ARTICLES].sort((a, b) => b.riskScore - a.riskScore).slice(0, 3);
    return `Today's cyber weather is **${w.label}**. Top stories:\n\n${top.map((a, i) => `${i + 1}. ${a.title} — Risk ${a.riskScore.toFixed(1)}`).join("\n")}\n\nPriorities: patch internet-facing appliances, rotate CI/CD secrets, and validate offline backups.`;
  }
  const cveMatch = q.match(/CVE-\d{4}-\d+/i);
  if (cveMatch) {
    const c = CVES.find((x) => x.id.toLowerCase() === cveMatch[0].toLowerCase());
    if (c) return `${c.id} — ${c.title}\nCVSS ${c.cvss.toFixed(1)} · AI Risk ${c.riskScore.toFixed(1)}\n${c.description}\n${c.exploitedInWild ? "Currently being exploited in the wild." : "No confirmed in-the-wild exploitation."}`;
    return `I couldn't find that CVE in the current dataset.`;
  }
  if (l.includes("healthcare")) {
    return `LockBit 4.0 is actively targeting hospitals in Europe using stolen credentials on Citrix and Fortinet appliances, then abusing ScreenConnect/AnyDesk for lateral movement. Enforce MFA on RMM tooling and segment clinical networks.`;
  }
  if (l.includes("away") || l.includes("miss")) {
    return `While you were away: 3 CISA KEV additions (Fortinet, VMware, Ivanti), OpenSSH regreSSHion, and a compromised GitHub Action leaking secrets from ~23k repos. See "Trending" for the full list.`;
  }
  if (l.includes("threat") || l.includes("biggest")) {
    return `The biggest active threats right now are: (1) OpenSSH regreSSHion pre-auth RCE, (2) FortiOS SSL VPN pre-auth RCE with ransomware weaponization, (3) LockBit 4.0 healthcare campaign, (4) hijacked GitHub Action supply-chain incident.`;
  }
  return `Great question. Here's a starting point based on your feed: focus on OpenSSH patching, review your CI/CD supply chain, and check if any of your assets appear in this week's CISA KEV additions.`;
}

function Assistant() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi — I'm your Cyber Brew assistant. Ask me about today's threats, a CVE, or what happened while you were away." },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", content: respond(text) }]);
      setThinking(false);
    }, 600 + Math.random() * 400);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-4xl flex-col">
      <div className="mb-4">
        <h1 className="font-display text-3xl font-bold tracking-tight">AI Assistant</h1>
        <p className="mt-1 text-sm text-muted-foreground">Ask anything about today's cyber landscape.</p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
            {m.role === "assistant" && (
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-brand text-white">
                <Sparkles className="h-4 w-4" />
              </div>
            )}
            <div className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              m.role === "user" ? "bg-primary text-primary-foreground" : "bg-background/60 border border-border/60"
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-brand text-white"><Sparkles className="h-4 w-4" /></div>
            <div className="rounded-2xl border border-border/60 bg-background/60 px-4 py-2.5 text-sm">
              <span className="inline-flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.2s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.1s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
              </span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {messages.length <= 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {PROMPTS.map((p) => (
            <button key={p} onClick={() => send(p)} className="rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40">
              {p}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="mt-3 flex items-center gap-2 rounded-2xl border border-border/60 bg-card/60 p-2 backdrop-blur">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about today's threats, a CVE, an actor…"
          className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
        />
        <button className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand px-4 py-2 text-sm font-medium text-white ring-glow disabled:opacity-40" disabled={!input.trim()}>
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}