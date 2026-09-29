/** Minimal 2D affine matrix [a b c d e f] matching SVG's transform model. */
export type M = [number, number, number, number, number, number];

export const I = (): M => [1, 0, 0, 1, 0, 0];
export const mul = (m: M, n: M): M => [
  m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1],
  m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3],
  m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5],
];
export const T = (x: number, y: number): M => [1, 0, 0, 1, x, y];
export const R = (deg: number): M => { const r = deg * Math.PI / 180, c = Math.cos(r), s = Math.sin(r); return [c, s, -s, c, 0, 0]; };
export const S = (x: number, y = x): M => [x, 0, 0, y, 0, 0];
export const apply = (m: M, x: number, y: number): [number, number] => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
export const svg = (m: M) => `matrix(${m.map((v) => +v.toFixed(4)).join(' ')})`;
