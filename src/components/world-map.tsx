import { useState } from "react";
import { THREAT_EVENTS, type ThreatEvent, severityColor } from "@/lib/mock-data";

function project(lat: number, lng: number, w = 800, h = 400) {
  const x = ((lng + 180) / 360) * w;
  const y = ((90 - lat) / 180) * h;
  return { x, y };
}

export function WorldMap({ onSelect }: { onSelect?: (e: ThreatEvent) => void }) {
  const [hovered, setHovered] = useState<ThreatEvent | null>(null);
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/50">
      <svg viewBox="0 0 800 400" className="w-full h-auto">
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="oklch(0.72 0.16 235)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="oklch(0.72 0.16 235)" stopOpacity="0" />
          </radialGradient>
          <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.9" fill="currentColor" opacity="0.45" />
          </pattern>
        </defs>
        <rect width="800" height="400" fill="url(#glow)" />
        <g className="text-primary">
          <path d="M100,80 Q160,60 240,90 T320,140 L300,200 L200,220 L120,180 Z" fill="url(#dots)" />
          <path d="M240,230 Q280,240 300,290 T280,360 L240,360 L220,300 Z" fill="url(#dots)" />
          <path d="M380,90 Q420,80 460,100 L470,150 L410,160 Z" fill="url(#dots)" />
          <path d="M400,170 Q450,180 470,220 T460,320 L410,320 L390,240 Z" fill="url(#dots)" />
          <path d="M470,80 Q560,70 660,110 T700,190 L620,220 L520,210 L480,160 Z" fill="url(#dots)" />
          <path d="M640,280 Q680,270 720,290 T710,330 L660,330 Z" fill="url(#dots)" />
        </g>
        {THREAT_EVENTS.map((e) => {
          const { x, y } = project(e.lat, e.lng);
          const color = e.severity === "critical" ? "#f43f5e" : e.severity === "high" ? "#fb923c" : e.severity === "medium" ? "#fbbf24" : "#34d399";
          return (
            <g
              key={e.id}
              transform={`translate(${x} ${y})`}
              className="cursor-pointer"
              onMouseEnter={() => setHovered(e)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect?.(e)}
            >
              <circle r="12" fill={color} opacity="0.2" className="animate-pulse-ring" style={{ transformOrigin: "center" }} />
              <circle r="4" fill={color} />
              <circle r="1.5" fill="white" />
            </g>
          );
        })}
      </svg>
      {hovered && (
        <div className="pointer-events-none absolute bottom-3 left-3 max-w-xs rounded-xl border border-border/60 bg-popover/95 p-3 text-xs shadow-xl backdrop-blur">
          <div className="flex items-center gap-2">
            <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase ${severityColor(hovered.severity)}`}>{hovered.severity}</span>
            <span className="font-medium">{hovered.country}</span>
            <span className="text-muted-foreground">· {hovered.time}</span>
          </div>
          <div className="mt-1 font-medium">{hovered.title}</div>
          <div className="text-muted-foreground">Industry: {hovered.industry}</div>
        </div>
      )}
    </div>
  );
}