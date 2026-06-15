import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Play, Pause, Heart, Subtitles, Music2, Maximize2, Info, Sun, Volume2, RotateCcw, RotateCw, Cast, PictureInPicture2, Settings2, ChevronRight, Shield } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { movies, featuredHero } from "@/lib/mock-data";
import { LiveBadge } from "@/components/badges";
import Hls from "hls.js";
import { toast } from "sonner";

export const Route = createFileRoute("/player/$id")({
  component: Player,
});

const DEMO_HLS_STREAM = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

function Player() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  
  const channels = useAppStore((s) => s.channels);
  const forceHttp = useAppStore((s) => s.forceHttp);
  const channel = channels.find((c) => c.id === id);
  const movie = movies.find((m) => m.id === id);
  const hero = featuredHero.find((h) => h.id === id);
  const isLive = !!channel;

  const title = channel?.name ?? movie?.title ?? hero?.title ?? "Now Playing";
  const subtitle = channel?.current ?? movie?.description ?? hero?.description ?? "";

  const [playing, setPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [playbackError, setPlaybackError] = useState(false);
  const [volume, setVolume] = useState(80);
  const [brightness, setBrightness] = useState(60);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showSide, setShowSide] = useState(false);
  const [showQuality, setShowQuality] = useState(false);
  const [quality, setQuality] = useState<"Auto" | "4K" | "1080p" | "720p">("Auto");
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ping = () => {
    setShowControls(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShowControls(false), 4000);
  };

  useEffect(() => {
    ping();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Initialize HLS / Video element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Get stream URL (real or fallback for demo)
    let streamUrl = channel?.streamUrl || "";
    if (isLive && !streamUrl) {
      streamUrl = DEMO_HLS_STREAM;
    }

    if (!streamUrl) {
      // For movie fallback if no URL
      video.src = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
      return;
    }

    // Force HTTP if enabled in settings
    if (forceHttp && streamUrl.startsWith("https://")) {
      console.log(`[Player] Force HTTP active. Changing stream URL to HTTP: ${streamUrl}`);
      streamUrl = streamUrl.replace("https://", "http://");
    }

    // Normalize Xtream Live stream URLs from .ts to .m3u8 (compatibility/cache fallback)
    if (isLive && streamUrl.includes("/live/") && streamUrl.endsWith(".ts")) {
      console.log(`[Player] Migrating cached .ts stream URL to .m3u8: ${streamUrl}`);
      streamUrl = streamUrl.replace(/\.ts$/, ".m3u8");
    }

    // Clean up previous Hls instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Event listener for native video error (mixed content / SSL cipher mismatch / native player error)
    const handleNativeVideoError = (e: Event) => {
      const currentSrc = video.src;
      if (currentSrc && currentSrc.startsWith("https://")) {
        const fallbackUrl = currentSrc.replace("https://", "http://");
        console.warn(`[Player] Native error on HTTPS stream. Retrying with HTTP fallback: ${fallbackUrl}`);
        toast.info("SSL Connection failed. Retrying with HTTP...");
        video.src = fallbackUrl;
        video.load();
        video.play().catch(err => {
          console.error("[Player] Native HTTP fallback play failed:", err);
          setPlaybackError(true);
        });
      } else {
        toast.error("Stream playback error. Please verify URL.");
        setPlaybackError(true);
      }
    };

    video.addEventListener("error", handleNativeVideoError);

    if (Hls.isSupported() && (streamUrl.includes(".m3u8") || streamUrl.includes(".ts") || isLive)) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hlsRef.current = hls;
      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // Automatic self-healing: if HTTPS fails, try HTTP fallback!
              const currentHlsSource = hls.url;
              if (currentHlsSource && currentHlsSource.startsWith("https://")) {
                const fallbackUrl = currentHlsSource.replace("https://", "http://");
                console.warn(`[Player] Network error on HTTPS stream. Retrying with HLS HTTP fallback: ${fallbackUrl}`);
                toast.info("SSL Handshake failed. Attempting HTTP fallback...");
                hls.loadSource(fallbackUrl);
                hls.startLoad();
              } else {
                toast.error("Network error playing stream. Retrying...");
                hls.startLoad();
                setTimeout(() => {
                  if (video.networkState === video.NETWORK_NO_SOURCE) {
                    setPlaybackError(true);
                  }
                }, 2000);
              }
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              toast.error("Media decoding error. Recovering...");
              hls.recoverMediaError();
              break;
            default:
              toast.error("Fatal playback error. Stopping.");
              setPlaybackError(true);
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari native support
      video.src = streamUrl;
    } else {
      // Fallback for regular MP4/direct links
      video.src = streamUrl;
    }

    return () => {
      video.removeEventListener("error", handleNativeVideoError);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [id, channel, isLive, forceHttp]);

  // Sync play/pause, volume controls
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.play().catch(() => setPlaying(false));
    } else {
      video.pause();
    }
  }, [playing]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = volume / 100;
  }, [volume]);

  // Handle progress updates for non-live content
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    const onLoadedMetadata = () => {
      setDuration(video.duration || 0);
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, []);

  const handleSeek = (newProgress: number) => {
    const video = videoRef.current;
    if (!video || isLive) return;
    const newTime = (newProgress / 100) * duration;
    video.currentTime = newTime;
    setProgress(newProgress);
  };

  const toggleFullscreen = () => {
    const container = videoRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => {
        toast.error(`Error enabling full-screen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div onClick={ping} className="relative flex h-screen w-screen flex-col overflow-hidden bg-black text-white">
      {/* Video area */}
      <div className="absolute inset-0 flex items-center justify-center">
        <video
          ref={videoRef}
          className="h-full w-full object-contain"
          style={{ filter: `brightness(${0.4 + brightness / 200})` }}
          playsInline
          autoPlay
          controls={false}
        />
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
      </div>

      {/* Top bar */}
      <header className={`relative z-10 flex items-center justify-between px-5 py-4 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <button onClick={() => navigate({ to: "/live" })} className="grid h-10 w-10 place-items-center rounded-full bg-black/40 backdrop-blur">
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
          <IconBtn onClick={toggleFullscreen}><Maximize2 className="h-5 w-5" /></IconBtn>
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
        {!isLive && (
          <button onClick={(e) => { e.stopPropagation(); handleSeek(Math.max(0, progress - 5)); }} className="grid h-14 w-14 place-items-center rounded-full bg-black/40 backdrop-blur transition active:scale-90">
            <RotateCcw className="h-7 w-7" />
            <span className="absolute mt-1 text-[10px] font-bold">10</span>
          </button>
        )}
        <button onClick={(e) => { e.stopPropagation(); setPlaying((p) => !p); }} className="grid h-20 w-20 place-items-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 transition active:scale-90">
          {playing ? <Pause className="h-10 w-10 fill-white" /> : <Play className="h-10 w-10 fill-white" />}
        </button>
        {!isLive && (
          <button onClick={(e) => { e.stopPropagation(); handleSeek(Math.min(100, progress + 5)); }} className="grid h-14 w-14 place-items-center rounded-full bg-black/40 backdrop-blur transition active:scale-90">
            <RotateCw className="h-7 w-7" />
            <span className="absolute mt-1 text-[10px] font-bold">10</span>
          </button>
        )}
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
                <span>{channel?.category}</span> · <span>Group: Active Playlist</span>
              </div>
              <h2 className="truncate text-xl font-black">{channel?.name} <span className="ml-1 align-top text-[10px] font-bold text-primary">LIVE</span></h2>
              <p className="mt-1 truncate text-xs text-white/80">▶ {channel?.current} → {channel?.next}</p>
            </div>
            <div className="text-right">
              <LiveBadge />
              <p className="mt-1 text-[10px] font-bold text-white/70">{channel?.quality || "HD"}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-2 flex items-center justify-between text-xs font-mono text-white/80">
              <span>{formatTime((progress / 100) * duration)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/20 cursor-pointer" onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              handleSeek((clickX / rect.width) * 100);
            }}>
              <div className="absolute inset-y-0 left-0 bg-primary" style={{ width: `${progress}%` }} />
              <div className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary shadow-glow" style={{ left: `calc(${progress}% - 6px)` }} />
            </div>
            <div className="mt-3">
              <h2 className="truncate text-lg font-black">{title}</h2>
              <p className="truncate text-xs text-white/77">{subtitle}</p>
            </div>
          </>
        )}
      </footer>

      {/* Side panel for Live quick switch */}
      {showSide && isLive && (
        <div className="absolute inset-0 z-25 flex justify-end bg-black/60 backdrop-blur-sm" onClick={() => setShowSide(false)}>
          <div onClick={(e) => e.stopPropagation()} className="h-full w-80 max-w-[85vw] overflow-y-auto border-l border-border bg-card p-4 animate-in slide-in-from-right">
            <h3 className="mb-3 text-sm font-bold">Quick Switch</h3>
            <div className="space-y-2">
              {channels.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { navigate({ to: "/player/$id", params: { id: c.id } }); setShowSide(false); }}
                  className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition ${c.id === id ? "border-primary bg-primary/10" : "border-border bg-surface hover:border-primary/50"}`}
                >
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-surface-2">
                    <img src={c.logo} alt={c.name} className="h-full w-full object-cover" onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=1A1A1A&color=fff&bold=true`;
                    }} />
                  </div>
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

      {/* Playback Error Overlay */}
      {playbackError && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-6 text-center">
          <div className="max-w-md space-y-5">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-destructive/15 text-destructive animate-pulse">
              <Shield className="h-8 w-8" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-bold">عذرًا، تعذر تشغيل البث في المتصفح</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                يحدث هذا عادةً بسبب قيود الأمان في المتصفحات (مثل قيود CORS أو شهادات SSL غير الصالحة على خادم البث).
              </p>
              <p className="text-xs text-muted-foreground/80 font-mono truncate max-w-[280px] sm:max-w-md mx-auto mt-1 px-3 py-1 bg-white/5 rounded border border-white/10">
                {channel?.streamUrl || DEMO_HLS_STREAM}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <a
                href={channel?.streamUrl || DEMO_HLS_STREAM}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold-gradient px-5 py-3 text-sm font-bold text-black shadow-glow active:scale-95 transition"
              >
                تشغيل في علامة تبويب جديدة
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(channel?.streamUrl || DEMO_HLS_STREAM);
                  toast.success("تم نسخ الرابط بنجاح!");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold active:scale-95 transition hover:bg-white/15"
              >
                نسخ رابط البث مباشرة
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setPlaybackError(false);
                setPlaying(true);
                const video = videoRef.current;
                if (video) {
                  video.load();
                  video.play().catch(() => {});
                }
              }}
              className="text-xs text-primary underline block mx-auto pt-2 hover:text-primary/80 cursor-pointer"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function IconBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return <button onClick={onClick} className="grid h-9 w-9 place-items-center rounded-full bg-black/30 backdrop-blur hover:bg-black/50">{children}</button>;
}

function formatTime(seconds: number) {
  if (isNaN(seconds)) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
