/**
 * CSS `font-style` type.
 */
export type FontStyle = 'normal' | 'italic' | 'oblique'

/**
 * CSS `font-display` type.
 */
export type FontDisplay = 'auto' | 'swap' | 'block' | 'fallback' | 'optional'

/**
 * CSS `font-weight` type.
 */
export type FontWeight = 'normal' | 'bold' | 'bolder' | 'lighter' | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900

/**
 * CSS `font-variant` type.
 */
export type FontVariant = 'normal' | 'small-caps'

/**
 * CSS font format type when providing `src` to `@font-face`.
 */
export type FontFormat = 'eot' | 'woff' | 'woff2' | 'truetype' | 'opentype' | 'svg'

/**
 * CSS `line-height` type.
 */
export type LineHeight = string | number

/**
 * CSS `letter-spacing` type.
 */
export type LetterSpacing = string | number

/**
 * All supported font weights.
 *
 * ```js
 * {
 *   thin: 100,
 *   extraLight: 200,
 *   light: 300,
 *   normal: 400,
 *   medium: 500,
 *   semiBold: 600,
 *   bold: 700,
 *   extraBold: 800,
 *   black: 900,
 * }
 * ```
 */
export const FONT_WEIGHTS: Record<string, FontWeight> = {
  thin: 100,
  extraLight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
  black: 900,
}
