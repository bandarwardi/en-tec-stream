import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ChevronLeft } from "lucide-react";
import { categories, channels } from "@/lib/mock-data";
import { LiveBadge, QualityBadge } from "@/components/badges";

export const Route = createFileRoute("/_app/live")({
  component: LivePage,
});

function LivePage() {
  const [cat, setCat] = useState<string>("All");
  const [q, setQ] = useState("");

  const filtered = useMemo(
    () =>
      channels.filter(
        (c) =>
          (cat === "All" || c.category === cat) &&
          (q === "" || c.name.toLowerCase().includes(q.toLowerCase())),
      ),
    [cat, q],
  );

  return (
    <div className="px-4 pt-5">
      <header className="mb-5 flex items-center gap-3">
        <Link to="/home" className="grid h-9 w-9 place-items-center rounded-full bg-surface"><ChevronLeft className="h-5 w-5" /></Link>
        <h1 className="text-2xl font-black">Live TV</h1>
      </header>

      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search channels…"
          className="w-full rounded-2xl border border-border bg-surface py-3 pl-11 pr-4 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
        {["All", ...categories].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              cat === c ? "bg-primary text-primary-foreground shadow-glow" : "bg-surface text-muted-foreground border border-border"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((ch) => (
          <Link
            key={ch.id}
            to="/player/$id"
            params={{ id: ch.id }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-4 transition hover:border-primary hover:shadow-glow"
          >
            <div className="flex items-start justify-between">
              <div className="h-12 w-12 overflow-hidden rounded-xl bg-surface-2 ring-1 ring-border">
                <img src={ch.logo} alt={ch.name} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <LiveBadge />
            </div>
            <h3 className="mt-3 truncate text-sm font-bold">{ch.name}</h3>
            <p className="truncate text-[11px] text-muted-foreground">▶ {ch.current}</p>
            <p className="truncate text-[11px] text-muted-foreground/70">→ {ch.next}</p>
            <div className="mt-2"><QualityBadge quality={ch.quality} /></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
