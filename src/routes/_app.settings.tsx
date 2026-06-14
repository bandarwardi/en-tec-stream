import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Globe, Bell, Languages, Shield, Star, Info, LogOut, ChevronRight, User, Volume2, Subtitles, Crown } from "lucide-react";
import { useAppStore } from "@/store/app-store";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const user = useAppStore((s) => s.user);
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);

  return (
    <div className="px-4 pt-5">
      <header className="mb-5 flex items-center gap-3">
        <Link to="/home" className="grid h-9 w-9 place-items-center rounded-full bg-surface"><ChevronLeft className="h-5 w-5" /></Link>
        <h1 className="text-2xl font-black">Settings</h1>
      </header>

      {/* Account */}
      <div className="mb-5 flex items-center gap-4 rounded-2xl border border-border bg-surface p-4">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-gold-gradient text-xl font-black text-black">{user?.name?.[0]?.toUpperCase() ?? "U"}</div>
        <div className="flex-1 min-w-0">
          <h2 className="truncate font-bold">{user?.name ?? "Guest"}</h2>
          <p className="truncate text-xs text-muted-foreground">{user?.email ?? "Not signed in"}</p>
          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-gold-gradient px-2 py-0.5 text-[10px] font-black text-black">
            <Crown className="h-2.5 w-2.5" /> {user?.plan ?? "Free"}
          </span>
        </div>
      </div>

      <Section title="Player">
        <Row icon={<Volume2 />} label="Default Quality" value="Auto · 4K" />
        <Row icon={<Languages />} label="Audio Language" value="Arabic, English" />
        <Row icon={<Subtitles />} label="Subtitles" value="On — English" />
      </Section>

      <Section title="App">
        <Row icon={<Globe />} label="Language" value={language === "ar" ? "العربية" : "English"} onClick={() => setLanguage(language === "ar" ? "en" : "ar")} />
        <Row icon={<Bell />} label="Notifications" value="Enabled" />
        <Row icon={<Shield />} label="Parental Control" value="Off" />
      </Section>

      <Section title="Subscription">
        <Row icon={<Star />} label="Current Plan" value="Premium 4K" />
        <button className="mt-2 w-full rounded-xl bg-gold-gradient py-3 text-sm font-black text-black shadow-glow active:scale-95">
          Upgrade to 8K Ultra
        </button>
      </Section>

      <Section title="About">
        <Row icon={<Info />} label="App Version" value="1.22 (3)" />
        <Row icon={<User />} label="Device Key" value="309324" />
      </Section>

      <button className="mt-6 mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 py-3 text-sm font-bold text-destructive">
        <LogOut className="h-4 w-4" /> Sign Out
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</h3>
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">{children}</div>
    </div>
  );
}

function Row({ icon, label, value, onClick }: { icon: React.ReactNode; label: string; value: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left last:border-0 hover:bg-surface-2">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-surface-2 text-primary">
        <span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      </span>
      <span className="flex-1 text-sm font-medium">{label}</span>
      <span className="text-xs text-muted-foreground">{value}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}
