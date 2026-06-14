import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, Star, Clock, Play, Heart, Mask as MaskIcon } from "lucide-react";
import { movies } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/movie/$id")({
  component: MovieDetailPage,
  loader: ({ params }) => {
    const movie = movies.find((m) => m.id === params.id);
    if (!movie) throw notFound();
    return { movie };
  },
  notFoundComponent: () => <div className="p-10 text-center">Movie not found</div>,
  errorComponent: ({ error }) => <div className="p-10 text-center text-destructive">{error.message}</div>,
});

function MovieDetailPage() {
  const { movie } = Route.useLoaderData();
  return (
    <div className="relative min-h-screen">
      {/* Backdrop */}
      <div className="absolute inset-x-0 top-0 h-[70vh] -z-10">
        <img src={movie.backdrop} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <header className="flex items-center gap-3 px-5 pt-5">
        <Link to="/movies" className="grid h-9 w-9 place-items-center rounded-full bg-surface/70 backdrop-blur"><ChevronLeft className="h-5 w-5" /></Link>
        <h1 className="text-lg font-semibold text-muted-foreground">Movie</h1>
      </header>

      <div className="px-5 pt-6 lg:flex lg:gap-8">
        {/* Poster */}
        <div className="mx-auto w-52 shrink-0 overflow-hidden rounded-2xl border border-border shadow-2xl lg:mx-0 lg:w-64">
          <img src={movie.poster} alt={movie.title} className="aspect-[2/3] w-full object-cover" />
        </div>

        {/* Info */}
        <div className="mt-6 flex-1 lg:mt-0">
          <h2 className="text-3xl font-black leading-tight lg:text-4xl">4K-AR-IN — {movie.title} ({movie.year})</h2>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>{movie.year}</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {movie.duration}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-surface px-2 py-0.5 text-xs font-bold text-foreground">
              <Star className="h-3 w-3 fill-primary text-primary" /> {movie.rating}
            </span>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground/85">{movie.description}</p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-surface/70 px-3 py-1.5 text-xs font-semibold backdrop-blur">
            <MaskIcon className="h-4 w-4 text-primary" />
            {movie.genres.join(", ")}
          </div>

          <p className="mt-4 text-sm italic text-foreground/80">{movie.cast.map((c) => c.name).join(", ")}</p>

          {/* CTAs */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 max-w-2xl">
            <Link to="/player/$id" params={{ id: movie.id }} className="inline-flex items-center justify-between gap-3 rounded-2xl bg-surface/80 px-5 py-3.5 text-sm font-bold backdrop-blur transition hover:bg-surface">
              Watch Now <Play className="h-5 w-5 fill-current" />
            </Link>
            <button className="inline-flex items-center justify-between gap-3 rounded-2xl bg-surface/80 px-5 py-3.5 text-sm font-bold backdrop-blur transition hover:bg-surface">
              Trailer <Play className="h-5 w-5" />
            </button>
            <button className="inline-flex items-center justify-between gap-3 rounded-2xl bg-surface/80 px-5 py-3.5 text-sm font-bold backdrop-blur transition hover:bg-surface">
              Add to Favorite <Heart className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Cast */}
      <section className="mt-10 px-5 pb-10">
        <h3 className="mb-4 text-lg font-bold">Cast:</h3>
        <div className="flex gap-5 overflow-x-auto scrollbar-hide -mx-5 px-5">
          {movie.cast.concat(movie.cast).map((c, i) => (
            <div key={i} className="shrink-0 w-24 text-center">
              <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-border">
                <img src={c.avatar} alt={c.name} className="h-full w-full object-cover" />
              </div>
              <p className="mt-2 truncate text-xs font-semibold">{c.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
