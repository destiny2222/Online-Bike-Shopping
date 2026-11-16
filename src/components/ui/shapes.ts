type Point = [number, number];

/**
 * Builds an SVG path for a polygon whose corners are rounded with radius `r`.
 * Used for the slanted cards in the design.
 */
export function roundedPolygonPath(points: Point[], r: number): string {
  const n = points.length;
  let d = '';

  for (let i = 0; i < n; i++) {
    const prev = points[(i - 1 + n) % n];
    const curr = points[i];
    const next = points[(i + 1) % n];

    const toPrev = unit(curr, prev);
    const toNext = unit(curr, next);
    const radius = Math.min(r, dist(curr, prev) / 2, dist(curr, next) / 2);

    const start: Point = [curr[0] + toPrev[0] * radius, curr[1] + toPrev[1] * radius];
    const end: Point = [curr[0] + toNext[0] * radius, curr[1] + toNext[1] * radius];

    d += `${i === 0 ? 'M' : 'L'}${start[0]},${start[1]} Q${curr[0]},${curr[1]} ${end[0]},${end[1]} `;
  }

  return d + 'Z';
}

/**
 * A card whose top and bottom edges slope up to the right by `slant` px.
 * `topSlant` / `bottomSlant` let you slope only one edge.
 */
export function slantedRectPath(
  width: number,
  height: number,
  { topSlant = 0, bottomSlant = 0, radius = 20 } = {}
): string {
  return roundedPolygonPath(
    [
      [0, topSlant],
      [width, 0],
      [width, height - bottomSlant],
      [0, height],
    ],
    radius
  );
}

const dist = (a: Point, b: Point) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const unit = (from: Point, to: Point): Point => {
  const l = dist(from, to) || 1;
  return [(to[0] - from[0]) / l, (to[1] - from[1]) / l];
};
