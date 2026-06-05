import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { fetchSportScoreboard, SPORTS, type SportEvent, type SportKey } from "@/lib/sports-api";

type Filter = "all" | "live" | "upcoming" | "final";

/**
 * LiveScore v1 — unified across every supported sport using ESPN's free
 * scoreboard endpoint. Auto-polls every 30s so scores stay fresh without
 * a manual reload.
 */
export function LiveScoreTab() {
  const [events, setEvents] = useState<Record<SportKey, SportEvent[]>>({} as Record<SportKey, SportEvent[]>);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [sport, setSport] = useState<SportKey | "all">("all");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const sports = SPORTS.filter((s) => s.espn).map((s) => s.key);
      const results = await Promise.all(sports.map(async (k) => [k, await fetchSportScoreboard(k)] as const));
      if (!cancelled) {
        const map = {} as Record<SportKey, SportEvent[]>;
        for (const [k, list] of results) map[k] = list;
        setEvents(map);
        setLoading(false);
      }
    };
    load();
    const t = window.setInterval(load, 30_000);
    return () => { cancelled = true; window.clearInterval(t); };
  }, []);

  const flat = useMemo(() => {
    const rows: Array<{ sport: SportKey; ev: SportEvent }> = [];
    for (const [k, list] of Object.entries(events)) {
      if (sport !== "all" && k !== sport) continue;
      for (const ev of list) rows.push({ sport: k as SportKey, ev });
    }
    return rows.filter((r) => {
      if (filter === "all") return true;
      if (filter === "live") return r.ev.status.state === "in";
      if (filter === "upcoming") return r.ev.status.state === "pre";
      if (filter === "final") return r.ev.status.state === "post";
      return true;
    });
  }, [events, sport, filter]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(["all", "live", "upcoming", "final"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-black uppercase tracking-wider ${
                filter === f ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-muted-foreground"
              }`}
            >{f}</button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSport("all")}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
              sport === "all" ? "border border-primary bg-primary/10 text-primary" : "border border-border bg-secondary/40 text-muted-foreground"
            }`}
          >All sports</button>
          {SPORTS.filter((s) => s.espn).map((s) => (
            <button
              key={s.key}
              onClick={() => setSport(s.key)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                sport === s.key ? "border border-primary bg-primary/10 text-primary" : "border border-border bg-secondary/40 text-muted-foreground"
              }`}
            >{s.emoji} {s.label}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
      ) : flat.length === 0 ? (
        <div className="rounded-2xl border border-border bg-secondary/40 p-8 text-center text-sm text-muted-foreground">
          No {filter !== "all" ? filter : ""} events found.
        </div>
      ) : (
        <ul className="space-y-2">
          {flat.map(({ sport: sp, ev }) => <Row key={`${sp}:${ev.id}`} sport={sp} ev={ev} />)}
        </ul>
      )}
    </div>
  );
}

function Row({ sport, ev }: { sport: SportKey; ev: SportEvent }) {
  const meta = SPORTS.find((s) => s.key === sport)!;
  const [a, b] = ev.competitors;
  const live = ev.status.state === "in";
  const final = ev.status.state === "post";
  const kickoff = new Date(ev.date);
  const status = live
    ? (ev.status.clock ? `${ev.status.clock}` : ev.status.detail || "LIVE")
    : final ? "FINAL"
    : kickoff.toLocaleString(undefined, { weekday: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <li className="glass-card flex items-center gap-3 rounded-2xl p-3">
      <div className="flex w-14 shrink-0 flex-col items-center gap-1 border-r border-border pr-3 text-center">
        <span className="text-lg leading-none">{meta.emoji}</span>
        <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">{meta.label}</span>
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        {a && b ? (
          <>
            <Comp c={a} live={live || final} />
            <Comp c={b} live={live || final} />
          </>
        ) : (
          <p className="truncate text-sm font-bold">{ev.name}</p>
        )}
        {ev.league && <p className="truncate text-[10px] text-muted-foreground">{ev.league}{ev.venue ? ` · ${ev.venue}` : ""}</p>}
      </div>
      <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-black tabular-nums ${
        live ? "animate-pulse bg-red-600 text-white"
        : final ? "bg-secondary text-muted-foreground"
        : "bg-primary/15 text-primary"
      }`}>{status}</span>
    </li>
  );
}

function Comp({ c, live }: { c: SportEvent["competitors"][number]; live: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${c.winner ? "" : live && !c.winner ? "opacity-70" : ""}`}>
      {c.logo ? <img src={c.logo} alt="" className="h-5 w-5 shrink-0 object-contain" loading="lazy" /> : <span className="h-5 w-5 shrink-0 rounded-full bg-secondary" />}
      <p className="min-w-0 flex-1 truncate text-xs font-bold">{c.name}</p>
      {live && <p className="shrink-0 text-sm font-black tabular-nums">{c.score}</p>}
    </div>
  );
}
