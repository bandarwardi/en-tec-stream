import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, Star, Play, Heart, Drama } from "lucide-react";
import { seriesList, type SeriesEpisode } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/series/$id")({
  component: SeriesDetailPage,
  loader: ({ params }) => {
    const series = seriesList.find((s) => s.id === params.id);
    if (!series) throw notFound();
    return { series };
  },
  notFoundComponent: () => <div className="p-10 text-center">Series not found</div>,
  errorComponent: ({ error }) => <div className="p-10 text-center text-destructive">{error.message}</div>,
});

function SeriesDetailPage() {
  const { series } = Route.useLoaderData();
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-x-0 top-0 h-[60vh] -z-10">
        <img src={series.backdrop} alt="" className="h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
      </div>

      <header className="flex items-center gap-3 px-5 pt-5">
        <Link to="/series" className="grid h-9 w-9 place-items-center rounded-full bg-surface/70 backdrop-blur"><ChevronLeft className="h-5 w-5" /></Link>
        <h1 className="text-lg font-semibold text-muted-foreground">Series</h1>
      </header>

      <div className="px-5 pt-6 lg:flex lg:gap-8">
        <div className="mx-auto w-52 shrink-0 overflow-hidden rounded-2xl border border-border shadow-2xl lg:mx-0 lg:w-64">
          <img src={series.poster} alt={series.title} className="aspect-[2/3] w-full object-cover" />
        </div>

        <div className="mt-6 flex-1 lg:mt-0">
          <h2 className="text-3xl font-black leading-tight lg:text-4xl">NF — {series.title} ({series.year})</h2>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>{series.year}</span>
            <span>• {series.seasons} Season{series.seasons > 1 ? "s" : ""}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-surface px-2 py-0.5 text-xs font-bold text-foreground">
              <Star className="h-3 w-3 fill-primary text-primary" /> {series.rating}
            </span>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground/85">{series.description}</p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-surface/70 px-3 py-1.5 text-xs font-semibold backdrop-blur">
            <Drama className="h-4 w-4 text-primary" />
            {series.genres.join(" / ")}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 max-w-2xl">
            <Link to="/player/$id" params={{ id: series.id }} className="inline-flex items-center justify-between gap-3 rounded-2xl bg-surface/80 px-5 py-3.5 text-sm font-bold backdrop-blur hover:bg-surface">
              Watch Now <Play className="h-5 w-5 fill-current" />
            </Link>
            <button className="inline-flex items-center justify-between gap-3 rounded-2xl bg-surface/80 px-5 py-3.5 text-sm font-bold backdrop-blur hover:bg-surface">
              Trailer Series <Play className="h-5 w-5" />
            </button>
            <button className="inline-flex items-center justify-between gap-3 rounded-2xl bg-surface/80 px-5 py-3.5 text-sm font-bold backdrop-blur hover:bg-surface">
              Add to Favorite <Heart className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Seasons */}
      <section className="mt-10 px-5 pb-10">
        <div className="mb-4 inline-block border-b-2 border-primary pb-1 text-sm font-bold">Season 1</div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-5 px-5">
          {series.episodes.map((ep: SeriesEpisode, i: number) => (
            <Link
              key={ep.id}
              to="/player/$id"
              params={{ id: series.id }}
              className={`group shrink-0 w-56 ${i === 0 ? "ring-2 ring-foreground rounded-xl" : ""}`}
            >
              <div className="relative aspect-video overflow-hidden rounded-xl border border-border">
                <img src={ep.thumbnail} alt={ep.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                {i === 0 && (
                  <div className="absolute inset-0 grid place-items-center bg-background/30">
                    <Play className="h-10 w-10 fill-foreground text-foreground" />
                  </div>
                )}
                <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between text-[11px] font-bold">
                  <span className="rounded bg-background/80 px-1.5 py-0.5">S1 .E{ep.number}</span>
                  <span className="rounded bg-background/80 px-1.5 py-0.5">{ep.duration}</span>
                </div>
              </div>
              <p className="mt-2 truncate text-xs font-medium">{series.title} — {ep.title}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
