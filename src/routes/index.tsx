import { createFileRoute } from "@tanstack/react-router";
import { Film, Tv, Sparkles, Trophy, Radio, Headphones, Youtube, Camera, Cctv, Play } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LaCzek Stream — One hub for everything you watch" },
      { name: "description", content: "A unified matte-black streaming interface for movies, series, anime, live sports, radio, podcasts, YouTube and live cameras." },
      { property: "og:title", content: "LaCzek Stream" },
      { property: "og:description", content: "One hub for movies, series, anime, sports, radio, podcasts and live streams." },
    ],
  }),
  component: Index,
});

const categories = [
  { icon: Film, title: "Movies", desc: "Aggregated from multiple sources." },
  { icon: Tv, title: "TV & Series", desc: "Seasons and episodes, structured." },
  { icon: Sparkles, title: "Anime", desc: "Curated catalog with categories." },
  { icon: Trophy, title: "Live Sports", desc: "Match streams when available." },
  { icon: Radio, title: "Live TV", desc: "Public channel feeds." },
  { icon: Headphones, title: "Radio", desc: "Stations across regions & genres." },
  { icon: Play, title: "Podcasts", desc: "Stream directly in the interface." },
  { icon: Youtube, title: "YouTube", desc: "Embedded videos & channels." },
  { icon: Camera, title: "Live Cams", desc: "Public live camera feeds." },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="/" className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-accent text-accent-foreground font-black">L</span>
            <span className="text-sm font-semibold tracking-widest uppercase">LaCzek<span className="text-muted-foreground"> Stream</span></span>
          </a>
          <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground transition">Features</a>
            <a href="#catalog" className="hover:text-foreground transition">Catalog</a>
            <a href="#stack" className="hover:text-foreground transition">Stack</a>
          </nav>
          <a href="#catalog" className="rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background hover:opacity-90 transition">
            Launch app
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-matte)" }}>
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />
        <div className="relative mx-auto max-w-7xl px-5 pt-20 pb-28 md:pt-32 md:pb-40">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Multi-source streaming hub
          </div>
          <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[1.02] tracking-tight md:text-7xl lg:text-8xl">
            One hub for<br/>
            <span className="italic font-light text-muted-foreground">everything</span> you watch.
          </h1>
          <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
            LaCzek Stream aggregates movies, series, anime, live sports, radio, podcasts and YouTube into a single fast, matte-black interface.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#catalog" className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-ember)] hover:translate-y-[-1px] transition">
              <Play className="h-4 w-4 fill-current" /> Start streaming
            </a>
            <a href="#features" className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-6 py-3 text-sm font-medium hover:bg-card transition">
              See features
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES STRIP */}
      <section id="features" className="border-y border-border bg-card/40">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-border md:grid-cols-4 md:divide-x">
          {[
            ["9+", "Content categories"],
            ["1", "Unified interface"],
            ["0", "Installs required"],
            ["∞", "Sources aggregated"],
          ].map(([n, l]) => (
            <div key={l} className="px-6 py-8">
              <div className="text-4xl font-black tracking-tight">{n}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CATALOG GRID */}
      <section id="catalog" className="mx-auto max-w-7xl px-5 py-24 md:py-32">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent">Catalog</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Everything, organized.</h2>
          </div>
          <p className="hidden max-w-sm text-sm text-muted-foreground md:block">
            Each category is a modular surface — lazy loaded, API-driven, mobile first.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(({ icon: Icon, title, desc }, i) => (
            <article key={title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition hover:border-accent/40">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/0 blur-2xl transition group-hover:bg-accent/20" />
              <div className="relative flex items-start justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-foreground group-hover:bg-accent group-hover:text-accent-foreground transition">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-mono text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="relative mt-6 text-lg font-semibold">{title}</h3>
              <p className="relative mt-1 text-sm text-muted-foreground">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* STACK */}
      <section id="stack" className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Built with</p>
          <div className="mt-6 flex flex-wrap gap-x-10 gap-y-4 text-2xl font-semibold md:text-4xl">
            {["TypeScript", "Vite", "Supabase", "Capacitor", "React"].map((t) => (
              <span key={t} className="text-muted-foreground hover:text-foreground transition">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 py-24 md:py-32 text-center">
        <h2 className="mx-auto max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
          Less fragmentation.<br/>
          <span className="text-muted-foreground italic font-light">More watching.</span>
        </h2>
        <a href="#catalog" className="mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground shadow-[var(--shadow-ember)] hover:translate-y-[-1px] transition">
          <Play className="h-4 w-4 fill-current" /> Open LaCzek Stream
        </a>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-8 text-xs text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} LaCzek Stream</span>
          <span>Matte-black edition</span>
        </div>
      </footer>
    </div>
  );
}
