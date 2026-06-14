import { create } from "zustand";

type Quality = "Auto" | "4K" | "1080p" | "720p";

type State = {
  isLoggedIn: boolean;
  user: { name: string; email: string; plan: string } | null;
  language: "ar" | "en";
  activePlaylistId: string;
  player: {
    volume: number;
    quality: Quality;
    isPlaying: boolean;
  };
  login: (name: string) => void;
  logout: () => void;
  setLanguage: (l: "ar" | "en") => void;
  setVolume: (v: number) => void;
  setQuality: (q: Quality) => void;
  togglePlay: () => void;
  setActivePlaylist: (id: string) => void;
};

export const useAppStore = create<State>((set) => ({
  isLoggedIn: true,
  user: { name: "test1", email: "test1@entec.tv", plan: "Premium 4K" },
  language: "en",
  activePlaylistId: "p1",
  player: { volume: 80, quality: "Auto", isPlaying: true },
  login: (name) => set({ isLoggedIn: true, user: { name, email: `${name}@entec.tv`, plan: "Premium 4K" } }),
  logout: () => set({ isLoggedIn: false, user: null }),
  setLanguage: (language) => set({ language }),
  setVolume: (v) => set((s) => ({ player: { ...s.player, volume: v } })),
  setQuality: (q) => set((s) => ({ player: { ...s.player, quality: q } })),
  togglePlay: () => set((s) => ({ player: { ...s.player, isPlaying: !s.player.isPlaying } })),
  setActivePlaylist: (id) => set({ activePlaylistId: id }),
}));
