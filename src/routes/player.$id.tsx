import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Play, Pause, Heart, Subtitles, Music2, Maximize2, Info, Sun, Volume2, RotateCcw, RotateCw, Cast, PictureInPicture2, Settings2, ChevronRight } from "lucide-react";
import { channels, movies, featuredHero } from "@/lib/mock-data";
import { LiveBadge } from "@/components/badges";

export const Route = createFileRoute("/player/$id")({
  component: Player,
});

function Player() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const channel = channels.find((c) => c.id === id);
  const movie = movies.find((m) => m.id === id);
  const hero = featuredHero.find((h) => h.id === id);
  const isLive = !!channel;
  const title = channel?.name ?? movie?.title ?? hero?.title ?? "Now Playing";
  const subtitle = channel?.current ?? movie?.description ?? hero?.description ?? "";

  const [playing, setPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [volume, setVolume] = useState(80);
  const [brightness, setBrightness] = useState(60);
  const [progress, setProgress] = useState(12);
  const [showSide, setShowSide] = useState(false);
  const [showQuality, setShowQuality] = useState(false);
  const [quality, setQuality] = useState<"Auto" | "4K" | "1080p" | "720p">("Auto");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ping = () => {
    setShowControls(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShowControls(false), 4000);
  };
  useEffect(() => { ping(); return () => { if (timerRef.current) clearTimeout(timerRef.current); }; }, []);

  useEffect(() => {
    if (!playing || isLive) return;
    const t = setInterval(() => setProgress((p) => (p < 100 ? p + 0.1 : p)), 500);
    return () => clearInterval(t);
  }, [playing, isLive]);

  return (
    <div onClick={ping} className="relative flex h-screen w-screen flex-col overflow-hidden bg-black text-white">
      {/* Video area */}
      <div className="absolute inset-0">
        <img
          src={channel ? "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1920&q=85" : (movie?.backdrop ?? hero?.backdrop ?? "")}
          alt={title}
          className="h-full w-full object-cover"
          style={{ filter: `brightness(${0.4 + brightness / 200})` }}
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Top bar */}
      <header className={`relative z-10 flex items-center justify-between px-5 py-4 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <button onClick={() => navigate({ to: "/home" })} className="grid h-10 w-10 place-items-center rounded-full bg-black/40 backdrop-blur">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="truncate text-base font-bold">{title}</h1>
        <div className="flex items-center gap-2">
          <IconBtn><Info className="h-5 w-5" /></IconBtn>
          <IconBtn><Heart className="h-5 w-5" /></IconBtn>
          <IconBtn><Subtitles className="h-5 w-5" /></IconBtn>
          <IconBtn><Music2 className="h-5 w-5" /></IconBtn>
          <IconBtn><Cast className="h-5 w-5" /></IconBtn>
          <IconBtn><PictureInPicture2 className="h-5 w-5" /></IconBtn>
          <IconBtn><Maximize2 className="h-5 w-5" /></IconBtn>
        </div>
      </header>

      {/* Side rails: brightness + volume */}
      <div className={`pointer-events-none absolute left-5 top-1/2 z-10 -translate-y-1/2 transition-opacity ${showControls ? "opacity-100" : "opacity-0"}`}>
        <div className="pointer-events-auto flex flex-col items-center gap-3">
          <Sun className="h-5 w-5" />
          <input type="range" min={0} max={100} value={brightness} onChange={(e) => setBrightness(+e.target.value)} className="h-48 w-1 appearance-none accent-white [writing-mode:vertical-lr] rotate-180" />
        </div>
      </div>
      <div className={`pointer-events-none absolute right-5 top-1/2 z-10 -translate-y-1/2 transition-opacity ${showControls ? "opacity-100" : "opacity-0"}`}>
        <div className="pointer-events-auto flex flex-col items-center gap-3">
          <Volume2 className="h-5 w-5" />
          <input type="range" min={0} max={100} value={volume} onChange={(e) => setVolume(+e.target.value)} className="h-48 w-1 appearance-none accent-white [writing-mode:vertical-lr] rotate-180" />
        </div>
      </div>

      {/* Center play controls */}
      <div className={`relative z-10 flex flex-1 items-center justify-center gap-10 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}>
        <button onClick={(e) => { e.stopPropagation(); setProgress((p) => Math.max(0, p - 5)); }} className="grid h-14 w-14 place-items-center rounded-full bg-black/40 backdrop-blur transition active:scale-90">
          <RotateCcw className="h-7 w-7" />
          <span className="absolute mt-1 text-[10px] font-bold">10</span>
        </button>
        <button onClick={(e) => { e.stopPropagation(); setPlaying((p) => !p); }} className="grid h-20 w-20 place-items-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 transition active:scale-90">
          {playing ? <Pause className="h-10 w-10 fill-white" /> : <Play className="h-10 w-10 fill-white" />}
        </button>
        <button onClick={(e) => { e.stopPropagation(); setProgress((p) => Math.min(100, p + 5)); }} className="grid h-14 w-14 place-items-center rounded-full bg-black/40 backdrop-blur transition active:scale-90">
          <RotateCw className="h-7 w-7" />
          <span className="absolute mt-1 text-[10px] font-bold">10</span>
        </button>
      </div>

      {/* Quality / side panel toggles */}
      <div className={`absolute bottom-24 right-5 z-10 flex flex-col gap-2 transition-opacity ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <button onClick={(e) => { e.stopPropagation(); setShowQuality((s) => !s); }} className="inline-flex items-center gap-2 rounded-full bg-black/60 backdrop-blur px-3 py-2 text-xs font-bold">
          <Settings2 className="h-4 w-4" /> {quality}
        </button>
        {isLive && (
          <button onClick={(e) => { e.stopPropagation(); setShowSide(true); }} className="inline-flex items-center gap-2 rounded-full bg-black/60 backdrop-blur px-3 py-2 text-xs font-bold">
            Channels <ChevronRight className="h-4 w-4" />
          </button>
        )}
        {showQuality && (
          <div className="absolute right-0 bottom-full mb-2 w-32 overflow-hidden rounded-xl border border-white/10 bg-black/90 backdrop-blur">
            {(["Auto", "4K", "1080p", "720p"] as const).map((q) => (
              <button key={q} onClick={(e) => { e.stopPropagation(); setQuality(q); setShowQuality(false); }} className={`block w-full px-3 py-2 text-left text-xs font-medium ${quality === q ? "bg-primary text-black" : "hover:bg-white/10"}`}>
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <footer className={`relative z-10 px-5 pb-6 pt-4 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        {isLive ? (
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2 text-[11px] font-bold text-white/70">
                <span>{channel?.category}</span> · <span>Group: All</span>
              </div>
              <h2 className="truncate text-xl font-black">{channel?.name} <span className="ml-1 align-top text-[10px] font-bold text-primary">RAW</span></h2>
              <p className="mt-1 truncate text-xs text-white/80">▶ {channel?.current} → {channel?.next}</p>
            </div>
            <div className="text-right">
              <LiveBadge />
              <p className="mt-1 text-[10px] font-bold text-white/70">1920×1080</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-2 flex items-center justify-between text-xs font-mono text-white/80">
              <span>{formatTime(progress * 0.6 * 60)}</span>
              <span>{formatTime(60 * 60)}</span>
            </div>
            <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/20">
              <div className="absolute inset-y-0 left-0 bg-primary" style={{ width: `${progress}%` }} />
              <div className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary shadow-glow" style={{ left: `calc(${progress}% - 6px)` }} />
            </div>
            <div className="mt-3">
              <h2 className="truncate text-lg font-black">{title}</h2>
              <p className="truncate text-xs text-white/70">{subtitle}</p>
            </div>
          </>
        )}
      </footer>

      {/* Side panel */}
      {showSide && isLive && (
        <div className="absolute inset-0 z-20 flex justify-end bg-black/60 backdrop-blur-sm" onClick={() => setShowSide(false)}>
          <div onClick={(e) => e.stopPropagation()} className="h-full w-80 max-w-[85vw] overflow-y-auto border-l border-border bg-card p-4 animate-in slide-in-from-right">
            <h3 className="mb-3 text-sm font-bold">Quick Switch</h3>
            <div className="space-y-2">
              {channels.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { navigate({ to: "/player/$id", params: { id: c.id } }); setShowSide(false); }}
                  className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition ${c.id === id ? "border-primary bg-primary/10" : "border-border bg-surface hover:border-primary/50"}`}
                >
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface-2"><img src={c.logo} alt={c.name} className="h-full w-full object-cover" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{c.name}</p>
                    <p className="truncate text-[10px] text-muted-foreground">{c.current}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function IconBtn({ children }: { children: React.ReactNode }) {
  return <button className="grid h-9 w-9 place-items-center rounded-full bg-black/30 backdrop-blur hover:bg-black/50">{children}</button>;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
