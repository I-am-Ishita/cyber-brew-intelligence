import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatedBackdrop } from "@/components/animated-bg";
import { Logo } from "@/components/logo";
import { actions, getState } from "@/lib/store";
import { ArrowRight, Github, Mail } from "lucide-react";

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Sign in — Cyber Brew" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const name = email.split("@")[0];
    actions.login(name.charAt(0).toUpperCase() + name.slice(1), email);
    navigate({ to: getState().onboarded ? "/app" : "/onboarding" });
  };

  return <AuthShell title="Welcome back" subtitle="Sign in to your Cyber Brew workspace." mode="login">
    <form onSubmit={submit} className="space-y-3">
      <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@company.com" />
      <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
      <div className="flex items-center justify-between text-xs">
        <label className="inline-flex items-center gap-2 text-muted-foreground"><input type="checkbox" className="accent-primary" /> Remember me</label>
        <Link to="/auth/forgot" className="text-primary hover:underline">Forgot password?</Link>
      </div>
      <button className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-brand py-2.5 text-sm font-medium text-white ring-glow">
        Sign in <ArrowRight className="h-4 w-4" />
      </button>
    </form>
    <Divider />
    <div className="grid grid-cols-2 gap-2">
      <SocialButton icon={<Mail className="h-4 w-4" />} label="Google" onClick={submit as any} />
      <SocialButton icon={<Github className="h-4 w-4" />} label="GitHub" onClick={submit as any} />
    </div>
    <p className="mt-6 text-center text-xs text-muted-foreground">
      Don't have an account? <Link to="/auth/register" className="text-primary hover:underline">Create one</Link>
    </p>
  </AuthShell>;
}

function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; mode?: string; children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <AnimatedBackdrop />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
        <div className="mb-8 flex justify-center"><Logo /></div>
        <div className="rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur">
          <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
        <Link to="/" className="mt-6 text-center text-xs text-muted-foreground hover:text-foreground">← Back to home</Link>
      </div>
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder }: { label: string; type: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="w-full rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}
function Divider() {
  return (
    <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
      <span className="h-px flex-1 bg-border" /> or continue with <span className="h-px flex-1 bg-border" />
    </div>
  );
}
function SocialButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} type="button" className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/50 py-2.5 text-sm hover:border-primary/40">
      {icon} {label}
    </button>
  );
}

export { AuthShell, Field, Divider, SocialButton };