import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, Field } from "./auth.login";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/auth/forgot")({
  component: ForgotPage,
  head: () => ({ meta: [{ title: "Reset password — Cyber Brew" }] }),
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <AuthShell title="Reset your password" subtitle="We'll email you a magic link.">
      {sent ? (
        <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
          <CheckCircle2 className="mb-2 h-5 w-5" />
          If an account exists for <span className="font-medium">{email}</span>, we've sent instructions.
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-3">
          <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@company.com" />
          <button className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-brand py-2.5 text-sm font-medium text-white ring-glow">
            Send reset link <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      )}
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Back to <Link to="/auth/login" className="text-primary hover:underline">sign in</Link>
      </p>
    </AuthShell>
  );
}