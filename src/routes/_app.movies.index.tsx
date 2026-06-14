import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Star, ChevronLeft } from "lucide-react";
import { movies } from "@/lib/mock-data";
import { QualityBadge } from "@/components/badges";

const FILTERS = ["All", "Action", "Drama", "Comedy", "Sci-Fi", "Thriller", "Adventure"];

export const Route = createFileRoute("/_app/movies/")({
  component: MoviesPage,
});

function MoviesPage() {
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");
  const items = useMemo(
    () =>
      movies.filter(
        (m) =>
          (filter === "All" || m.genres.includes(filter)) &&
          (q === "" || m.title.toLowerCase().includes(q.toLowerCase())),
      ),
    [filter, q],
  );

  return (
    <div className="px-4 pt-5">
      <header className="mb-5 flex items-center gap-3">
        <Link to="/home" className="grid h-9 w-9 place-items-center rounded-full bg-surface"><ChevronLeft className="h-5 w-5" /></Link>
        <h1 className="text-2xl font-black">Movies</h1>
      </header>

      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search movies…" className="w-full rounded-2xl border border-border bg-surface py-3 pl-11 pr-4 text-sm outline-none focus:border-primary" />
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              filter === f ? "bg-primary text-primary-foreground shadow-glow" : "bg-surface text-muted-foreground border border-border"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {items.map((m) => (
          <Link key={m.id} to="/movie/$id" params={{ id: m.id }} className="group">
            <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-border">
              <img src={m.poster} alt={m.title} className="h-full w-full object-cover transition group-hover:scale-105" />
              <div className="absolute top-2 right-2"><QualityBadge quality={m.quality} /></div>
              <div className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded bg-background/70 backdrop-blur px-1.5 py-0.5 text-[10px] font-bold">
                <Star className="h-2.5 w-2.5 fill-primary text-primary" /> {m.rating}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-100 transition" />
            </div>
            <p className="mt-2 truncate text-sm font-semibold">{m.title}</p>
            <p className="text-[11px] text-muted-foreground">{m.year} · {m.duration}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
