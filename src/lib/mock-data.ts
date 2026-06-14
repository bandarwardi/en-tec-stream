export type Channel = {
  id: string;
  name: string;
  logo: string;
  category: string;
  current: string;
  next: string;
  quality: "4K" | "FHD" | "HD";
  isLive: boolean;
};

export type Movie = {
  id: string;
  title: string;
  poster: string;
  backdrop: string;
  rating: number;
  year: number;
  duration: string;
  quality: "4K" | "FHD" | "HD";
  genres: string[];
  description: string;
  cast: { name: string; avatar: string }[];
};

export type Series = {
  id: string;
  title: string;
  poster: string;
  rating: number;
  seasons: number;
  genres: string[];
};

const POSTERS = [
  "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=600&q=80",
  "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=600&q=80",
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&q=80",
  "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=600&q=80",
  "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&q=80",
  "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&q=80",
  "https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=600&q=80",
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80",
];

const BACKDROPS = [
  "https://images.unsplash.com/photo-1489599735734-79b4af4f4d6e?w=1600&q=80",
  "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1600&q=80",
  "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=1600&q=80",
];

const AVATARS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
  "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&q=80",
];

export const categories = ["Sports", "News", "Movies", "Kids", "Arabic", "Music", "Documentaries", "Entertainment"];

export const channels: Channel[] = [
  { id: "c1", name: "FOX SPORTS 1", logo: "📺", category: "Sports", current: "FIFA World Cup Today", next: "FIFA World Cup 2026", quality: "4K", isLive: true },
  { id: "c2", name: "BeIN Sports", logo: "⚽", category: "Sports", current: "Premier League Live", next: "Match Analysis", quality: "4K", isLive: true },
  { id: "c3", name: "MBC 4K", logo: "🎬", category: "Arabic", current: "Top Chef Arabia", next: "Evening News", quality: "4K", isLive: true },
  { id: "c4", name: "MBC ACTION", logo: "💥", category: "Movies", current: "Mission Impossible", next: "The Equalizer", quality: "FHD", isLive: true },
  { id: "c5", name: "Al Jazeera", logo: "📰", category: "News", current: "Breaking News", next: "Inside Story", quality: "FHD", isLive: true },
  { id: "c6", name: "CNN International", logo: "🌐", category: "News", current: "World News", next: "Amanpour", quality: "HD", isLive: true },
  { id: "c7", name: "Cartoon Network", logo: "🎨", category: "Kids", current: "Ben 10", next: "Adventure Time", quality: "HD", isLive: true },
  { id: "c8", name: "Disney Channel", logo: "🏰", category: "Kids", current: "Mickey Mouse", next: "Frozen Movie", quality: "FHD", isLive: true },
  { id: "c9", name: "Rotana Cinema", logo: "🎭", category: "Arabic", current: "Karuppu (2026)", next: "Classic Film", quality: "4K", isLive: true },
  { id: "c10", name: "National Geographic", logo: "🌍", category: "Documentaries", current: "Planet Earth", next: "Wild Africa", quality: "4K", isLive: true },
  { id: "c11", name: "Discovery", logo: "🔬", category: "Documentaries", current: "Gold Rush", next: "Mythbusters", quality: "FHD", isLive: true },
  { id: "c12", name: "MTV Live", logo: "🎵", category: "Music", current: "Top 40 Countdown", next: "Live Concert", quality: "HD", isLive: true },
  { id: "c13", name: "MBC 1", logo: "📺", category: "Arabic", current: "Arab Idol", next: "Drama Night", quality: "FHD", isLive: true },
  { id: "c14", name: "Sky Sports F1", logo: "🏎", category: "Sports", current: "Monaco GP", next: "Race Highlights", quality: "4K", isLive: true },
  { id: "c15", name: "ESPN", logo: "🏀", category: "Sports", current: "NBA Finals", next: "SportsCenter", quality: "FHD", isLive: true },
  { id: "c16", name: "HBO", logo: "🎬", category: "Movies", current: "House of Dragon", next: "Last of Us", quality: "4K", isLive: true },
  { id: "c17", name: "Netflix Live", logo: "🅽", category: "Entertainment", current: "Stranger Things", next: "Wednesday", quality: "4K", isLive: true },
  { id: "c18", name: "BBC News", logo: "🇬🇧", category: "News", current: "BBC World", next: "HARDtalk", quality: "HD", isLive: true },
  { id: "c19", name: "Nickelodeon", logo: "🟧", category: "Kids", current: "SpongeBob", next: "Paw Patrol", quality: "HD", isLive: true },
  { id: "c20", name: "Dubai TV", logo: "🇦🇪", category: "Arabic", current: "Morning Show", next: "News Hour", quality: "FHD", isLive: true },
  { id: "c21", name: "MBC MAX", logo: "🎥", category: "Movies", current: "Inception", next: "Interstellar", quality: "4K", isLive: true },
  { id: "c22", name: "Boomerang", logo: "🐰", category: "Kids", current: "Tom & Jerry", next: "Looney Tunes", quality: "HD", isLive: true },
];

const movieTitles = [
  "Karuppu", "Mission Impossible", "The Equalizer", "Dune Part Two", "Oppenheimer",
  "Barbie", "John Wick 4", "Spider-Man", "The Batman", "Top Gun: Maverick",
  "Avatar: Way of Water", "Black Panther", "Doctor Strange", "Fast X", "The Marvels",
];

export const movies: Movie[] = movieTitles.map((title, i) => ({
  id: `m${i + 1}`,
  title,
  poster: POSTERS[i % POSTERS.length],
  backdrop: BACKDROPS[i % BACKDROPS.length],
  rating: +(6.5 + Math.random() * 2.5).toFixed(1),
  year: 2024 + (i % 3),
  duration: `${1 + (i % 3)}h ${(15 + i * 7) % 60}m`,
  quality: (["4K", "FHD", "HD"] as const)[i % 3],
  genres: [["Action", "Thriller"], ["Drama", "Sci-Fi"], ["Comedy", "Adventure"]][i % 3],
  description: "An epic journey of justice, betrayal, and redemption. In a world where the divine spirit of righteousness fades, a lawyer rises to confront oppression and restore what was broken.",
  cast: Array.from({ length: 6 }, (_, j) => ({
    name: ["Suriya", "Trisha", "RJ Balaji", "Indrans", "Anagha Maya", "Swasika"][j],
    avatar: AVATARS[j % AVATARS.length],
  })),
}));

export const seriesList: Series[] = Array.from({ length: 10 }, (_, i) => ({
  id: `s${i + 1}`,
  title: ["Friends", "Breaking Bad", "Stranger Things", "Wednesday", "The Crown", "Squid Game", "Money Heist", "Dark", "Peaky Blinders", "Succession"][i],
  poster: POSTERS[(i + 2) % POSTERS.length],
  rating: +(7 + Math.random() * 2.5).toFixed(1),
  seasons: 1 + (i % 6),
  genres: [["Drama"], ["Thriller", "Mystery"], ["Comedy"]][i % 3],
}));

export const featuredHero = [
  {
    id: "h1",
    title: "Karuppu",
    subtitle: "4K-AR-IN · Karuppu (2026)",
    backdrop: "https://images.unsplash.com/photo-1489599735734-79b4af4f4d6e?w=1920&q=85",
    description: "An epic tale of justice. A lawyer touched by divine spirit rises against oppression.",
    rating: 7.3,
    year: 2026,
    duration: "2h 31m",
    genres: ["Action", "Fantasy"],
  },
  {
    id: "h2",
    title: "FIFA World Cup 2026",
    subtitle: "LIVE · FOX Sports 1",
    backdrop: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1920&q=85",
    description: "Live coverage from Philadelphia. Don't miss a single match.",
    rating: 9.1,
    year: 2026,
    duration: "LIVE",
    genres: ["Sports", "Live"],
  },
  {
    id: "h3",
    title: "Dune: Part Two",
    subtitle: "4K HDR · Dolby Atmos",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&q=85",
    description: "Paul Atreides unites with Chani and the Fremen on a warpath of revenge.",
    rating: 8.7,
    year: 2024,
    duration: "2h 46m",
    genres: ["Sci-Fi", "Adventure"],
  },
];

export const playlists = [
  { id: "p1", name: "My Main Playlist", url: "http://example.com/playlist1.m3u", channels: 16881, updated: "2 hours ago", active: true },
  { id: "p2", name: "Sports Pack 4K", url: "http://example.com/sports.m3u", channels: 348, updated: "Yesterday", active: false },
  { id: "p3", name: "Arabic Bundle", url: "http://example.com/arabic.m3u", channels: 1245, updated: "3 days ago", active: false },
];
