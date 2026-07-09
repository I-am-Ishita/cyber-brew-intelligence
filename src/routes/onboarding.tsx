import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatedBackdrop } from "@/components/animated-bg";
import { Logo } from "@/components/logo";
import { ROLES, FOLLOW_CATALOG } from "@/lib/mock-data";
import { actions, useStore } from "@/lib/store";
import { ArrowRight, Check, Sparkles } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
  head: () => ({ meta: [{ title: "Onboarding — Cyber Brew" }] }),
});

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const role = useStore((s) => s.role);
  const follows = useStore((s) => s.follows);
  const steps = ["Your role", "Your interests", "You're brewed"];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <AnimatedBackdrop />
      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-10">
        <div className="flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            Step {step + 1} of {steps.length}
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-gradient-brand" : "bg-border"}`} />
          ))}
        </div>

        <div className="mt-10 flex-1">
          {step === 0 && (
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight">Which best describes you?</h1>
              <p className="mt-2 text-muted-foreground">We'll personalize your feed, summaries, and risk framing.</p>
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {ROLES.map((r) => {
                  const active = role === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => actions.setRole(r.id)}
                      className={`group rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 ${
                        active ? "border-primary bg-primary/10 ring-1 ring-primary/40" : "border-border/60 bg-card/50 hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-display text-base font-semibold">{r.label}</span>
                        {active && <Check className="h-4 w-4 text-primary" />}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{r.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight">What do you want to follow?</h1>
              <p className="mt-2 text-muted-foreground">Pick as many as you like — you can change these later.</p>
              <div className="mt-8 space-y-6">
                {Object.entries(FOLLOW_CATALOG).map(([group, items]) => (
                  <div key={group}>
                    <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">{group.replace(/([A-Z])/g, " $1").trim()}</div>
                    <div className="flex flex-wrap gap-2">
                      {items.map((item) => {
                        const active = follows.includes(item);
                        return (
                          <button
                            key={item}
                            onClick={() => actions.toggleFollow(item)}
                            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                              active ? "border-primary bg-primary/15 text-foreground" : "border-border/60 bg-card/50 text-muted-foreground hover:text-foreground hover:border-primary/40"
                            }`}
                          >
                            {active && <Check className="mr-1 inline h-3 w-3" />}
                            {item}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="mx-auto max-w-md text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-brand ring-glow">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h1 className="mt-6 font-display text-3xl font-bold tracking-tight">You're brewed. ☕</h1>
              <p className="mt-2 text-muted-foreground">Your dashboard is now personalized. Let's dive in.</p>
              <div className="mt-6 rounded-2xl border border-border/60 bg-card/60 p-4 text-left">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Following</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {follows.slice(0, 10).map((f) => (
                    <span key={f} className="rounded-full border border-border bg-accent/50 px-2 py-0.5 text-xs">{f}</span>
                  ))}
                  {follows.length === 0 && <span className="text-sm text-muted-foreground">Nothing yet — you can add later.</span>}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="rounded-xl px-4 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-0"
          >
            Back
          </button>
          {step < 2 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 0 && !role}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-medium text-white ring-glow disabled:opacity-40"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => { actions.completeOnboarding(); navigate({ to: "/app" }); }}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-sm font-medium text-white ring-glow"
            >
              Enter Cyber Brew <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}