import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Bell, Shield, Star, Info, LogOut, ChevronRight, User, Volume2, Subtitles, Crown, List, Menu } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { useState } from "react";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const user = useAppStore((s) => s.user);
  const playlists = useAppStore((s) => s.playlists);
  const forceHttp = useAppStore((s) => s.forceHttp);
  const setForceHttp = useAppStore((s) => s.setForceHttp);
  
  const player = useAppStore((s) => s.player);
  const setQuality = useAppStore((s) => s.setQuality);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);
  
  const navigate = useNavigate();

  // Quality settings toggler
  const toggleQuality = () => {
    const qualities: ("Auto" | "4K" | "1080p" | "720p")[] = ["Auto", "4K", "1080p", "720p"];
    const currentIdx = qualities.indexOf(player.quality as any);
    const nextIdx = (currentIdx + 1) % qualities.length;
    const nextVal = qualities[nextIdx];
    console.log("[Settings] Toggling quality to:", nextVal);
    setQuality(nextVal);
  };

  // Subtitles settings toggler
  const [subtitles, setSubtitles] = useState(() => {
    try {
      return typeof window !== "undefined" ? localStorage.getItem("settings_subtitles") || "English" : "English";
    } catch (e) {
      return "English";
    }
  });
  const toggleSubtitles = () => {
    const options = ["English", "Arabic", "Off"];
    const currentIdx = options.indexOf(subtitles);
    const nextIdx = (currentIdx + 1) % options.length;
    const nextVal = options[nextIdx];
    console.log("[Settings] Toggling subtitles to:", nextVal);
    setSubtitles(nextVal);
    try {
      localStorage.setItem("settings_subtitles", nextVal);
    } catch (e) {}
  };

  // Notifications settings toggler
  const [notifications, setNotifications] = useState(() => {
    try {
      return typeof window !== "undefined" ? localStorage.getItem("settings_notifications") !== "false" : true;
    } catch (e) {
      return true;
    }
  });
  const toggleNotifications = () => {
    const nextVal = !notifications;
    console.log("[Settings] Toggling notifications to:", nextVal);
    setNotifications(nextVal);
    try {
      localStorage.setItem("settings_notifications", String(nextVal));
    } catch (e) {}
  };

  // Parental Control settings toggler
  const [parentalControl, setParentalControl] = useState(() => {
    try {
      return typeof window !== "undefined" ? localStorage.getItem("settings_parental") === "true" : false;
    } catch (e) {
      return false;
    }
  });
  const toggleParental = () => {
    const nextVal = !parentalControl;
    console.log("[Settings] Toggling parental control to:", nextVal);
    setParentalControl(nextVal);
    try {
      localStorage.setItem("settings_parental", String(nextVal));
    } catch (e) {}
  };

  return (
    <div className="px-4 pt-5 pb-20">
      <header className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to="/home" className="grid h-9 w-9 place-items-center rounded-full bg-surface"><ChevronLeft className="h-5 w-5" /></Link>
          <h1 className="text-2xl font-black">Settings</h1>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="grid h-9 w-9 place-items-center rounded-full bg-surface lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
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
        <Row icon={<Volume2 />} label="Default Quality" value={player.quality} onClick={toggleQuality} />
        <Row icon={<Subtitles />} label="Subtitles" value={subtitles === "Off" ? "Off" : `On — ${subtitles}`} onClick={toggleSubtitles} />
        <Row icon={<Shield />} label="Force HTTP (Bypass SSL)" value={forceHttp ? "Enabled" : "Disabled"} onClick={() => {
          console.log("[Settings] Toggling forceHttp to:", !forceHttp);
          setForceHttp(!forceHttp);
        }} />
      </Section>

      <Section title="App">
        <Row icon={<List />} label="Playlists" value={`${playlists.length} Loaded`} onClick={() => navigate({ to: "/playlists" })} />
        <Row icon={<Bell />} label="Notifications" value={notifications ? "Enabled" : "Disabled"} onClick={toggleNotifications} />
        <Row icon={<Shield />} label="Parental Control" value={parentalControl ? "On" : "Off"} onClick={toggleParental} />
      </Section>

      <Section title="Subscription">
        <Row icon={<Star />} label="Current Plan" value={user?.plan ?? "Premium 4K"} />
      </Section>

      <Section title="About">
        <Row icon={<Info />} label="App Version" value="1.22 (3)" />
        <Row icon={<User />} label="Device Key" value="309324" />
      </Section>

      <button type="button" className="mt-6 mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 py-3 text-sm font-bold text-destructive cursor-pointer">
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
    <button type="button" onClick={onClick} className="flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left last:border-0 hover:bg-surface-2 cursor-pointer">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-surface-2 text-primary">
        <span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      </span>
      <span className="flex-1 text-sm font-medium">{label}</span>
      <span className="text-xs text-muted-foreground">{value}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}
