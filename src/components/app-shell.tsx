import { Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { Bell, Bookmark, Command, Home, Map, Menu, Newspaper, Search, ShieldAlert, Sparkles, TrendingUp, User, LogOut, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { Logo } from "./logo";
import { CommandPalette } from "./command-palette";
import { actions, useStore } from "@/lib/store";

const NAV = [
  { to: "/app", label: "Dashboard", icon: Home, exact: true },
  { to: "/app/news", label: "News", icon: Newspaper },
  { to: "/app/cves", label: "CVEs", icon: ShieldAlert },
  { to: "/app/threats", label: "Threat Map", icon: Map },
  { to: "/app/trending", label: "Trending", icon: TrendingUp },
  { to: "/app/assistant", label: "AI Assistant", icon: Sparkles },
  { to: "/app/bookmarks", label: "Bookmarks", icon: Bookmark },
  { to: "/app/profile", label: "Profile", icon: User },
] as const;

export function AppShell() {
  const [openMobile, setOpenMobile] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const name = useStore((s) => s.name) || "Analyst";
  const theme = useStore((s) => s.theme);
  const navigate = useNavigate();

  const isActive = (to: string, exact?: boolean) => (exact ? pathname === to : pathname === to || pathname.startsWith(to + "/"));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CommandPalette />
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-border/60 bg-sidebar/80 backdrop-blur transition-transform lg:translate-x-0 ${openMobile ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center px-5">
            <Logo />
          </div>
          <nav className="flex-1 space-y-0.5 px-3">
            {NAV.map((item) => {
              const active = isActive(item.to, "exact" in item ? item.exact : false);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpenMobile(false)}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-primary" : ""}`} />
                  <span>{item.label}</span>
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-border/60 p-3">
            <div className="flex items-center gap-3 rounded-lg px-2 py-2">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-brand text-xs font-semibold text-white">
                {name.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{name}</div>
                <div className="truncate text-xs text-muted-foreground">Signed in</div>
              </div>
              <button
                aria-label="Sign out"
                onClick={() => { actions.logout(); navigate({ to: "/" }); }}
                className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {openMobile && (
        <button
          aria-label="Close menu"
          onClick={() => setOpenMobile(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 lg:px-8">
            <button className="lg:hidden grid h-9 w-9 place-items-center rounded-lg hover:bg-accent" onClick={() => setOpenMobile(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigate({ to: "/app/search" })}
              className="group flex flex-1 items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:border-primary/40"
            >
              <Search className="h-4 w-4" />
              <span className="flex-1">Search articles, CVEs, actors…</span>
              <span className="hidden items-center gap-1 rounded-md border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground sm:inline-flex">
                <Command className="h-3 w-3" />K
              </span>
            </button>
            <button
              onClick={() => actions.setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button aria-label="Notifications" className="relative grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-400 ring-2 ring-background" />
            </button>
          </div>
        </header>
        <main className="px-4 py-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}