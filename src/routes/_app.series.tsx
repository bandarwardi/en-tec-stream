import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Star } from "lucide-react";
import { seriesList } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/series")({
  component: SeriesPage,
});

function SeriesPage() {
  return (
    <div className="px-4 pt-5">
      <header className="mb-5 flex items-center gap-3">
        <Link to="/home" className="grid h-9 w-9 place-items-center rounded-full bg-surface"><ChevronLeft className="h-5 w-5" /></Link>
        <h1 className="text-2xl font-black">Series</h1>
      </header>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {seriesList.map((s) => (
          <Link key={s.id} to="/player/$id" params={{ id: s.id }} className="group">
            <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-border">
              <img src={s.poster} alt={s.title} className="h-full w-full object-cover transition group-hover:scale-105" />
              <div className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded bg-background/70 backdrop-blur px-1.5 py-0.5 text-[10px] font-bold">
                <Star className="h-2.5 w-2.5 fill-primary text-primary" /> {s.rating}
              </div>
            </div>
            <p className="mt-2 truncate text-sm font-semibold">{s.title}</p>
            <p className="text-[11px] text-muted-foreground">{s.seasons} season{s.seasons > 1 ? "s" : ""}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
