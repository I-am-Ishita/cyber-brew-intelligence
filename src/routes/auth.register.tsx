import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthShell, Field, Divider, SocialButton } from "./auth.login";
import { actions } from "@/lib/store";
import { ArrowRight, Github, Mail } from "lucide-react";

export const Route = createFileRoute("/auth/register")({
  component: RegisterPage,
  head: () => ({ meta: [{ title: "Create account — Cyber Brew" }] }),
});

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    actions.login(name || email.split("@")[0], email);
    navigate({ to: "/onboarding" });
  };

  return (
    <AuthShell title="Start brewing" subtitle="Create your account — personalized in 30 seconds.">
      <form onSubmit={submit} className="space-y-3">
        <Field label="Full name" type="text" value={name} onChange={setName} placeholder="Ada Lovelace" />
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@company.com" />
        <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="At least 8 characters" />
        <button className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-brand py-2.5 text-sm font-medium text-white ring-glow">
          Create account <ArrowRight className="h-4 w-4" />
        </button>
      </form>
      <Divider />
      <div className="grid grid-cols-2 gap-2">
        <SocialButton icon={<Mail className="h-4 w-4" />} label="Google" onClick={submit as any} />
        <SocialButton icon={<Github className="h-4 w-4" />} label="GitHub" onClick={submit as any} />
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Already have an account? <Link to="/auth/login" className="text-primary hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  );
}