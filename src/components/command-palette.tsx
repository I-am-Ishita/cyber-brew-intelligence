import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { ARTICLES, CVES, THREAT_ACTORS, MALWARE } from "@/lib/mock-data";
import { Bookmark, FileText, Home, Map, Newspaper, Search, ShieldAlert, Sparkles, User } from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (fn: () => void) => {
    setOpen(false);
    setTimeout(fn, 0);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search articles, CVEs, actors, pages…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => go(() => navigate({ to: "/app" }))}><Home className="mr-2 h-4 w-4" />Dashboard</CommandItem>
          <CommandItem onSelect={() => go(() => navigate({ to: "/app/news" }))}><Newspaper className="mr-2 h-4 w-4" />News</CommandItem>
          <CommandItem onSelect={() => go(() => navigate({ to: "/app/cves" }))}><ShieldAlert className="mr-2 h-4 w-4" />CVE Explorer</CommandItem>
          <CommandItem onSelect={() => go(() => navigate({ to: "/app/threats" }))}><Map className="mr-2 h-4 w-4" />Threat Map</CommandItem>
          <CommandItem onSelect={() => go(() => navigate({ to: "/app/assistant" }))}><Sparkles className="mr-2 h-4 w-4" />AI Assistant</CommandItem>
          <CommandItem onSelect={() => go(() => navigate({ to: "/app/bookmarks" }))}><Bookmark className="mr-2 h-4 w-4" />Bookmarks</CommandItem>
          <CommandItem onSelect={() => go(() => navigate({ to: "/app/profile" }))}><User className="mr-2 h-4 w-4" />Profile</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Articles">
          {ARTICLES.slice(0, 6).map((a) => (
            <CommandItem key={a.id} onSelect={() => go(() => navigate({ to: "/app/news/$id", params: { id: a.slug } }))}>
              <FileText className="mr-2 h-4 w-4" />{a.title}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="CVEs">
          {CVES.slice(0, 6).map((c) => (
            <CommandItem key={c.id} onSelect={() => go(() => navigate({ to: "/app/cves/$id", params: { id: c.id } }))}>
              <ShieldAlert className="mr-2 h-4 w-4" />{c.id} — {c.title}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Threat Actors & Malware">
          {THREAT_ACTORS.map((a) => (
            <CommandItem key={a.id} onSelect={() => go(() => navigate({ to: "/app/search", search: { q: a.name } }))}>
              <Search className="mr-2 h-4 w-4" />{a.name}
            </CommandItem>
          ))}
          {MALWARE.map((m) => (
            <CommandItem key={m.id} onSelect={() => go(() => navigate({ to: "/app/search", search: { q: m.name } }))}>
              <Search className="mr-2 h-4 w-4" />{m.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}