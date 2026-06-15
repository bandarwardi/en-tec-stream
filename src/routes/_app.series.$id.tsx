import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, Star, Play, Heart, Drama } from "lucide-react";
import { toast } from "sonner";
import { seriesList, type SeriesEpisode } from "@/lib/mock-data";
import { DetailSkeleton } from "@/components/detail-skeleton";
import { useAppStore } from "@/store/app-store";

export const Route = createFileRoute("/_app/series/$id")({
  component: SeriesDetailPage,
  pendingComponent: DetailSkeleton,
  pendingMs: 0,
  loader: async ({ params }) => {
    let series = seriesList.find((s) => s.id === params.id);
    if (!series) {
      const channel = useAppStore.getState().channels.find((c) => c.id === params.id);
      if (channel) {
        series = {
          id: channel.id,
          title: channel.name,
          poster: channel.logo,
          backdrop: channel.logo,
          rating: 8.0,
          seasons: 1,
          year: 2026,
          genres: [channel.category],
          description: `TV Series: ${channel.name} from category ${channel.category}.`,
          episodes: [
            {
              id: `${channel.id}_e1`,
              number: 1,
              title: "Episode 1",
              duration: "45m",
              thumbnail: channel.logo
            }
          ]
        };
      }
    }
    if (!series) throw notFound();
    return { series };
  },
  notFoundComponent: () => <div className="p-10 text-center">Series not found</div>,
  errorComponent: ({ error }) => {
    if (typeof window !== "undefined") toast.error("Failed to load series", { description: error.message });
    return <div className="p-10 text-center text-destructive">{error.message}</div>;
  },
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

      {/* Episodes */}
      <section className="mt-10 space-y-8 px-5 pb-10">
        {/* Current episode */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse-live" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary">Current Episode</h3>
          </div>
          {series.episodes.slice(0, 1).map((ep: SeriesEpisode) => (
            <Link key={ep.id} to="/player/$id" params={{ id: series.id }} className="flex gap-4 rounded-2xl border border-primary/40 bg-primary/5 p-3 transition hover:bg-primary/10">
              <div className="relative aspect-video w-44 shrink-0 overflow-hidden rounded-xl">
                <img src={ep.thumbnail} alt={ep.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 grid place-items-center bg-background/30">
                  <Play className="h-9 w-9 fill-foreground text-foreground" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Season {series.seasons >= 1 ? 1 : series.seasons} · Episode {ep.number}</p>
                <h4 className="mt-1 truncate text-base font-bold">{ep.title}</h4>
                <p className="mt-1 text-xs text-muted-foreground">{ep.duration}</p>
                <p className="mt-2 line-clamp-2 text-xs text-foreground/80">{series.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Upcoming */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider">Upcoming Episodes</h3>
            <span className="text-xs text-muted-foreground">Season 1 · {series.episodes.length} episodes</span>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide -mx-5 px-5">
            {series.episodes.slice(1).map((ep: SeriesEpisode) => (
              <Link key={ep.id} to="/player/$id" params={{ id: series.id }} className="group shrink-0 w-56">

                <div className="relative aspect-video overflow-hidden rounded-xl border border-border">
                  <img src={ep.thumbnail} alt={ep.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                  <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between text-[11px] font-bold">
                    <span className="rounded bg-background/80 px-1.5 py-0.5">S1·E{ep.number}</span>
                    <span className="rounded bg-background/80 px-1.5 py-0.5">{ep.duration}</span>
                  </div>
                </div>
                <p className="mt-2 truncate text-xs font-medium">{ep.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
