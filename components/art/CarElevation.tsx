import type { GlassZone, ServiceId } from "@/content/site";

// One car, drawn in the logo's line style: a modern SUV coupe in side elevation, facing left.
// Each service owns a layer: glass and UV rays (sun film), high-impact outlines (PPF), a gloss
// line along the body (ceramic) and interior lines (detailing). The shade guide reuses the
// glass panels by zone. viewBox 1200 x 460, ground at y = 420.

export const BODY =
  "M118 376 C106 366 100 346 104 330 C104 314 106 302 110 296 C116 290 122 286 130 284 C230 274 340 256 450 236 C506 196 552 158 600 128 C652 112 700 106 752 107 C826 110 886 120 940 140 C986 160 1026 184 1056 204 L1090 212 C1096 228 1098 244 1098 262 C1100 306 1098 340 1092 362 C1088 372 1080 376 1070 376 L975 376 A92 92 0 1 0 801 376 L349 376 A92 92 0 1 0 175 376 Z";

export const GLASS: Record<GlassZone, string> = {
  windscreen: "M450 236 C506 196 552 158 600 128 L618 140 C574 166 534 200 492 232 Z",
  front: "M498 231 C540 200 578 168 618 146 C652 132 700 125 733 124 L728 229 Z",
  rear: "M752 124 C822 125 880 135 924 156 C944 172 954 192 956 212 L748 227 Z",
  back: "M944 144 C986 164 1024 186 1050 202 L1034 204 C1004 188 972 170 940 156 Z",
};

const WHEELS = [262, 888];
const WHEEL_Y = 346;
// Five twin spokes.
const SPOKES = Array.from({ length: 5 }, (_, i) => (i * 2 * Math.PI) / 5).flatMap((a) => [a - 0.12, a + 0.12]);

const MIRROR = "M474 238 C476 224 492 217 512 219 L516 233 C500 235 487 237 474 238 Z";
const FRONT_DOOR = "M492 233 C490 280 492 330 502 372";
const REAR_DOOR = "M956 214 C954 246 940 268 908 276";

const PPF_PATHS = [
  // bonnet
  "M130 284 C230 274 340 256 450 236",
  // front bumper face
  "M118 376 C106 366 100 346 104 330 C104 314 106 302 110 296",
  MIRROR,
  FRONT_DOOR,
  REAR_DOOR,
];

// UV rays arrive from the upper left and stop at the glass.
const UV_RAYS = [
  [546, 204],
  [650, 137],
  [800, 128],
  [905, 151],
].map(([x, y]) => ({ x2: x, y2: y, x1: x - 92, y1: y - 150 }));

export function CarElevation({
  zone,
  id,
  label,
  className,
  glassTint,
  activeGlass,
  showRays = true,
  children,
}: {
  /** Which service layer is lit. */
  zone?: ServiceId;
  id: string;
  label: string;
  className?: string;
  /** Shade guide: per-zone tint opacity (0 to 1). */
  glassTint?: Partial<Record<GlassZone, number>>;
  /** Shade guide: the glass zone being edited. */
  activeGlass?: GlassZone;
  showRays?: boolean;
  /** Extra layers drawn in the same coordinates (the shade guide's sun and rays). */
  children?: React.ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 1200 460"
      className={`car ${className ?? ""}`}
      data-zone={zone}
      role="img"
      aria-label={label}
      id={id}
    >
      {/* ground */}
      <line x1="140" y1="420" x2="1070" y2="420" className="car-ground" />

      {/* glass panels (tint lives here) */}
      <g className="z-glass-group">
        {(Object.keys(GLASS) as GlassZone[]).map((key) => (
          <path
            key={key}
            d={GLASS[key]}
            className="z-glass"
            data-glass={key}
            data-active={activeGlass === key ? "true" : undefined}
            style={glassTint?.[key] !== undefined ? { fillOpacity: glassTint[key] } : undefined}
          />
        ))}
      </g>

      {/* interior, seen through the glass (detailing) */}
      <g className="z-interior">
        <path d="M512 236 C546 224 586 218 626 218 L636 236" />
        <ellipse cx="628" cy="198" rx="8" ry="22" transform="rotate(-16 628 198)" />
        <path d="M704 230 C698 200 698 172 708 154 C712 146 722 144 726 152 C730 172 728 200 722 230" />
        <path d="M709 148 C709 136 726 136 726 148" />
        <path d="M872 226 C868 198 870 176 882 162 C888 156 896 158 898 166 C900 186 898 206 894 226" />
        <path d="M880 160 C881 148 897 149 897 161" />
      </g>

      {/* body */}
      <g className="car-lines">
        <path d={BODY} className="car-body" />
        <path d={GLASS.front} />
        <path d={GLASS.rear} />
        <path d="M734 124 L750 124 L746 228 L730 229 Z" />
        <path d={FRONT_DOOR} />
        <path d="M739 229 L741 372" />
        <path d={REAR_DOOR} />
        <path d="M644 258 L680 256 M866 250 L900 248" />
        <path d={MIRROR} />
        <path d="M116 296 C146 290 180 286 214 286" className="car-lamp" />
        <path d="M1062 222 L1096 230" className="car-lamp" />
        <path d="M106 344 L158 346" />
        <path d="M356 354 L794 354" className="car-crease" />
        <path d="M168 312 A100 100 0 0 1 356 312 M794 312 A100 100 0 0 1 982 312" />
        {WHEELS.map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy={WHEEL_Y} r="74" />
            <circle cx={cx} cy={WHEEL_Y} r="52" />
            <circle cx={cx} cy={WHEEL_Y} r="10" />
            {SPOKES.map((angle) => (
              <line
                key={angle}
                x1={(cx + Math.cos(angle) * 15).toFixed(1)}
                y1={(WHEEL_Y + Math.sin(angle) * 15).toFixed(1)}
                x2={(cx + Math.cos(angle) * 50).toFixed(1)}
                y2={(WHEEL_Y + Math.sin(angle) * 50).toFixed(1)}
              />
            ))}
          </g>
        ))}
      </g>

      {/* PPF: high-impact zones */}
      <g className="z-ppf">
        {PPF_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      {/* ceramic: gloss along the whole body line */}
      <g className="z-gloss">
        <path d={BODY} className="z-gloss-line" />
      </g>

      {/* sun film: UV rays stopping at the film */}
      {showRays ? (
        <g className="z-uv">
          {UV_RAYS.map((ray) => (
            <g key={`${ray.x2}`}>
              <line x1={ray.x1} y1={ray.y1} x2={ray.x2} y2={ray.y2} className="z-uv-ray" />
              <circle cx={ray.x2} cy={ray.y2} r="3.5" className="z-uv-stop" />
            </g>
          ))}
        </g>
      ) : null}
      {children}
    </svg>
  );
}
