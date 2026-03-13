"use client";

import { useState, useEffect } from "react";

const fontLink =
  "https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap";

interface ClockZone {
  label: string;
  timezone: string;
  zuluOffset: string;
  locationCode: string;
}

const ZONES: ClockZone[] = [
  { label: "NEW YORK CITY", timezone: "America/New_York", zuluOffset: "ZULU-5", locationCode: "NYC-01" },
  { label: "MANILA · PHILIPPINES", timezone: "Asia/Manila", zuluOffset: "ZULU+8", locationCode: "MNL-08" },
];

function formatTime(date: Date, timezone: string) {
  return date.toLocaleTimeString("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function formatDate(date: Date, timezone: string) {
  return date.toLocaleDateString("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function ClockPanel({ zone, now }: { zone: ClockZone; now: Date | null }) {
  const timeStr = now ? formatTime(now, zone.timezone) : "--:--:--";
  const dateStr = now ? formatDate(now, zone.timezone) : "--/--/----";

  return (
    <div
      className="relative flex-1 flex flex-col items-center gap-5 px-8 py-7"
      style={{
        background: "linear-gradient(160deg, #0a1a08 0%, #050d04 60%, #020802 100%)",
        border: "1px solid #2a5c1a",
        boxShadow: "0 0 0 1px #0f2a0a, 0 0 40px 4px rgba(80,200,50,0.07), inset 0 0 60px rgba(0,0,0,0.6)",
      }}
    >
      {/* Corner brackets */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-green-500 opacity-60" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-green-500 opacity-60" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-green-500 opacity-60" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-green-500 opacity-60" />

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #39ff14 0px, #39ff14 1px, transparent 1px, transparent 4px)",
        }}
      />

      {/* Noise vignette */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, #000d00 100%)",
        }}
      />

      {/* Header bar */}
      <div
        className="w-full flex items-center justify-between px-2 py-1"
        style={{ borderBottom: "1px solid #1a3a10", marginBottom: "4px" }}
      >
        <span className="text-green-600 text-xs tracking-[0.3em] opacity-70">
          ▶ RobCo CHRONO-SYS v2.3
        </span>
        <span className="text-green-500 text-xs tracking-widest opacity-60">
          [{zone.locationCode}]
        </span>
      </div>

      {/* Location label */}
      <div
        className="text-xs tracking-[0.5em] uppercase text-center"
        style={{ color: "#5dde30", textShadow: "0 0 10px rgba(93,222,48,0.5)" }}
      >
        ◈ {zone.label} ◈
      </div>

      {/* Time display */}
      <div
        className="tracking-widest leading-none text-center"
        style={{
          fontSize: "clamp(4rem, 16vw, 18rem)",
          color: "#57ff2a",
          textShadow:
            "0 0 6px rgba(87,255,42,1), 0 0 20px rgba(87,255,42,0.6), 0 0 60px rgba(87,255,42,0.2)",
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "0.08em",
        }}
      >
        {timeStr}
      </div>

      {/* Divider with pip-boy style ticks */}
      <div className="w-full flex items-center gap-1">
        <div className="flex-1 h-px" style={{ background: "#1e4a10" }} />
        <div className="text-green-800 text-xs">◆</div>
        <div className="flex-1 h-px" style={{ background: "#1e4a10" }} />
      </div>

      {/* Date + TZ */}
      <div className="flex justify-between w-full text-sm tracking-[0.2em]" style={{ color: "#3a9922" }}>
        <span> {dateStr}</span>
        <span className="opacity-70">{zone.zuluOffset}</span>
      </div>

      {/* Status row */}
      <div
        className="w-full flex justify-between text-xs tracking-[0.2em] uppercase px-1 pt-1"
        style={{ borderTop: "1px solid #1a3a10", color: "#2a6a15" }}
      >
        <span style={{ color: "#57ff2a", textShadow: "0 0 8px rgba(87,255,42,0.8)" }}>
          ◉ SIGNAL ACTIVE
        </span>
        <span>CLK SYNC ██████░░ 87%</span>
      </div>
    </div>
  );
}

export default function DualClock() {
  const [now, setNow] = useState<Date | null>(null);
  const [bootText, setBootText] = useState("INITIALIZING...");

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = fontLink;
    document.head.appendChild(link);

    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 1000);

    // Boot sequence flavor text
    const messages = ["LOADING CHRONO-SYS...", "SYNCING ATOMIC CLOCK...", "VAULT-TEC ONLINE.", "ALL SYSTEMS NOMINAL."];
    let i = 0;
    const bootId = setInterval(() => {
      i++;
      if (i < messages.length) setBootText(messages[i]);
      else clearInterval(bootId);
    }, 600);

    return () => {
      clearInterval(id);
      clearInterval(bootId);
    };
  }, []);

  return (
    <div
      className="h-full w-full flex flex-col items-center justify-center gap-5 p-6"
      style={{
        background: "radial-gradient(ellipse at center, #071507 0%, #020902 60%, #000000 100%)",
        fontFamily: "'Share Tech Mono', monospace",
      }}
    >
      {/* Top system header */}
      <div className="w-full max-w-6xl flex items-center justify-between px-2">
        <div className="text-xs tracking-[0.4em] uppercase" style={{ color: "#2a6a15" }}>
          ▶ VAULT-TEC INDUSTRIES
        </div>
        <div className="text-xs tracking-[0.5em] uppercase" style={{ color: "#3a8a20", textShadow: "0 0 8px rgba(87,255,42,0.3)" }}>
          ◈ DUAL TIMEZONE DISPLAY ◈
        </div>
        <div className="text-xs tracking-[0.4em] uppercase" style={{ color: "#2a6a15" }}>
          PIP-BOY 3000 MK IV
        </div>
      </div>

      {/* Top divider */}
      <div className="w-full max-w-6xl h-px" style={{ background: "linear-gradient(90deg, transparent, #2a6a15, transparent)" }} />

      {/* Clock panels */}
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl">
        {ZONES.map((zone) => (
          <ClockPanel key={zone.timezone} zone={zone} now={now} />
        ))}
      </div>

      {/* Bottom divider */}
      <div className="w-full max-w-6xl h-px" style={{ background: "linear-gradient(90deg, transparent, #2a6a15, transparent)" }} />

      {/* Footer */}
      <div className="w-full max-w-6xl flex items-center justify-between px-2">
        <div className="text-xs tracking-[0.3em] uppercase" style={{ color: "#1a4a0e" }}>
          OFFSET DELTA · +13H · MNL AHEAD OF NYC
        </div>
        <div className="text-xs tracking-[0.3em] uppercase" style={{ color: "#3a8a20" }}>
          {bootText}
        </div>
      </div>
    </div>
  );
}