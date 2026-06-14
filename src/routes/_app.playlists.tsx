import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Plus, Edit2, Trash2, RefreshCw, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { playlists as seedPlaylists } from "@/lib/mock-data";
import { useAppStore } from "@/store/app-store";

export const Route = createFileRoute("/_app/playlists")({
  component: PlaylistsPage,
});

function PlaylistsPage() {
  const [items, setItems] = useState(seedPlaylists);
  const [modalOpen, setModalOpen] = useState(false);
  const active = useAppStore((s) => s.activePlaylistId);
  const setActive = useAppStore((s) => s.setActivePlaylist);

  return (
    <div className="px-4 pt-5">
      <header className="mb-5 flex items-center gap-3">
        <Link to="/settings" className="grid h-9 w-9 place-items-center rounded-full bg-surface"><ChevronLeft className="h-5 w-5" /></Link>
        <h1 className="flex-1 text-2xl font-black">Playlists</h1>
        <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-xl bg-gold-gradient px-3 py-2 text-xs font-bold text-black shadow-glow">
          <Plus className="h-4 w-4" /> Add
        </button>
      </header>

      <div className="space-y-3">
        {items.map((p) => {
          const isActive = active === p.id;
          return (
            <div key={p.id} onClick={() => setActive(p.id)} className={`group rounded-2xl border p-4 transition cursor-pointer ${isActive ? "border-primary bg-primary/5 shadow-glow" : "border-border bg-surface"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-bold">{p.name}</h3>
                    {isActive && <CheckCircle2 className="h-4 w-4 text-primary" />}
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-foreground font-mono">{p.url}</p>
                  <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span>{p.channels.toLocaleString()} channels</span>
                    <span>•</span>
                    <span>Updated {p.updated}</span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <IconBtn><RefreshCw className="h-4 w-4" /></IconBtn>
                  <IconBtn><Edit2 className="h-4 w-4" /></IconBtn>
                  <IconBtn onClick={() => setItems(items.filter((x) => x.id !== p.id))}><Trash2 className="h-4 w-4 text-destructive" /></IconBtn>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/80 backdrop-blur p-4" onClick={() => setModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-card animate-in slide-in-from-bottom">
            <h2 className="text-xl font-bold">Add Playlist</h2>
            <p className="mt-1 text-sm text-muted-foreground">Paste an M3U/M3U8 URL to import channels.</p>
            <form onSubmit={(e) => { e.preventDefault(); setModalOpen(false); }} className="mt-5 space-y-3">
              <input placeholder="Playlist name" className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none focus:border-primary" />
              <input required placeholder="https://example.com/list.m3u" className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none focus:border-primary font-mono" />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 rounded-xl border border-border bg-surface py-3 text-sm font-bold">Cancel</button>
                <button type="submit" className="flex-1 rounded-xl bg-gold-gradient py-3 text-sm font-bold text-black shadow-glow">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function IconBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={(e) => { e.stopPropagation(); onClick?.(); }} className="grid h-8 w-8 place-items-center rounded-lg bg-surface-2 hover:bg-muted">
      {children}
    </button>
  );
}
