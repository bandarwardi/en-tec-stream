import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Tv, Film, Folder, Settings, Search, RefreshCw, User, LogOut, PlayCircle } from "lucide-react";
import { Logo } from "@/components/logo";

const top = [
  { to: "/home" as const, icon: Home, label: "Home" },
  { to: "/live" as const, icon: Tv, label: "Live TV" },
  { to: "/catchup" as const, icon: PlayCircle, label: "Catch-Up" },
  { to: "/movies" as const, icon: Film, label: "Movies" },
  { to: "/series" as const, icon: Folder, label: "Series" },
];

export function SideNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[68px] flex-col items-center justify-between border-r border-border bg-background/95 py-4 backdrop-blur-xl lg:flex">
      <div className="flex flex-col items-center gap-4">
        <Logo size={36} />
        <button className="grid h-10 w-10 place-items-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface">
          <Search className="h-5 w-5" />
        </button>
        <nav className="flex flex-col items-center gap-2">
          {top.map((t) => {
            const active = path.startsWith(t.to);
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`grid h-11 w-11 place-items-center rounded-xl border transition ${
                  active
                    ? "border-primary bg-primary/10 text-primary shadow-glow"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-surface"
                }`}
                title={t.label}
              >
                <Icon className="h-5 w-5" />
              </Link>
            );
          })}
          <button className="grid h-10 w-10 place-items-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface">
            <RefreshCw className="h-5 w-5" />
          </button>
        </nav>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Link to="/settings" className="grid h-10 w-10 place-items-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface" title="Account">
          <User className="h-5 w-5" />
        </Link>
        <Link to="/settings" className="grid h-10 w-10 place-items-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface" title="Settings">
          <Settings className="h-5 w-5" />
        </Link>
        <Link to="/login" className="grid h-10 w-10 place-items-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface" title="Log out">
          <LogOut className="h-5 w-5" />
        </Link>
      </div>
    </aside>
  );
}
