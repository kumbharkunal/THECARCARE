// The shield roof from the logo: a green outer chevron over a blue inner one that fades to
// lavender at the ends, like the original artwork. Geometry is measured from the client's
// logo file (apex at the centre, roof slope 0.375 outer and 0.352 inner). Used only in the
// hero, the process markers and the footer. The PNG stays the logo everywhere else.

type Roof = {
  /** Centre x of the apex in the parent viewBox. */
  cx: number;
  /** Apex y of the outer chevron's centre line. */
  apexY: number;
  /** Half the outer chevron's width (centre line to leg centre line). */
  halfWidth: number;
  /** y where the outer legs end. */
  legEnd: number;
  /** Stroke width of the outer chevron; the inner one is half as heavy. */
  stroke: number;
};

export function roofPoints({ cx, apexY, halfWidth, legEnd, stroke }: Roof) {
  const outerShoulder = apexY + halfWidth * 0.375;
  const gap = stroke * 1.55;
  const innerHalf = halfWidth - gap;
  const innerApex = apexY + gap * 1.15;
  const innerShoulder = innerApex + innerHalf * 0.352;
  const innerEnd = innerShoulder + (legEnd - outerShoulder) * 0.62;
  return {
    outer: `${cx - halfWidth},${legEnd} ${cx - halfWidth},${outerShoulder} ${cx},${apexY} ${cx + halfWidth},${outerShoulder} ${cx + halfWidth},${legEnd}`,
    inner: `${cx - innerHalf},${innerEnd} ${cx - innerHalf},${innerShoulder} ${cx},${innerApex} ${cx + innerHalf},${innerShoulder} ${cx + innerHalf},${innerEnd}`,
    innerTop: innerApex,
    innerEnd,
  };
}

/** Two polylines for the roof, ready to drop inside an <svg>. */
export function ChevronRoof({
  id,
  className,
  ...roof
}: Roof & { id: string; className?: string }) {
  const p = roofPoints(roof);
  return (
    <g className={className}>
      <defs>
        <linearGradient id={`${id}-fade`} x1="0" y1={p.innerTop} x2="0" y2={p.innerEnd} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--color-care-blue)" />
          <stop offset="0.55" stopColor="var(--color-care-blue)" />
          <stop offset="0.85" stopColor="var(--color-lavender)" />
          <stop offset="1" stopColor="var(--color-lavender)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        className="chev chev-outer"
        points={p.outer}
        pathLength={1}
        fill="none"
        stroke="var(--color-shield-green)"
        strokeWidth={roof.stroke}
        strokeLinejoin="miter"
        strokeLinecap="butt"
      />
      <polyline
        className="chev chev-inner"
        points={p.inner}
        pathLength={1}
        fill="none"
        stroke={`url(#${id}-fade)`}
        strokeWidth={roof.stroke * 0.5}
        strokeLinejoin="miter"
        strokeLinecap="butt"
      />
    </g>
  );
}

/** Small standalone chevron mark (ticker separators, process markers). */
export function ChevronMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 26"
      width="40"
      height="26"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      <polyline
        className="mark-outer"
        points="4,22 4,12 20,4 36,12 36,22"
        fill="none"
        stroke="var(--color-shield-green)"
        strokeWidth="3.2"
        strokeLinejoin="miter"
      />
      <polyline
        className="mark-inner"
        points="10,22 10,15.5 20,10.6 30,15.5 30,22"
        fill="none"
        stroke="var(--color-care-blue)"
        strokeWidth="1.8"
        strokeLinejoin="miter"
      />
    </svg>
  );
}
