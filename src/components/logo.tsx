import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2 group ${className}`}>
      <span className="relative grid h-8 w-8 place-items-center rounded-xl bg-gradient-brand ring-glow">
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4Z" />
          <path d="M9 12h6M12 9v6" />
        </svg>
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">
        Cyber<span className="text-gradient-brand">Brew</span>
      </span>
    </Link>
  );
}