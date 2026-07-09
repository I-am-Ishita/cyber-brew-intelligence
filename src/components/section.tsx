import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export function Section({
  title,
  subtitle,
  href,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  href?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {action ??
          (href ? (
            <Link to={href} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : null)}
      </div>
      {children}
    </section>
  );
}