import { AtRule, Declaration } from 'postcss'
import { FontDisplay, FontFormat, FontStyle, FontWeight, FONT_WEIGHTS } from '../types'

/**
 * Shorthand for defining a `@font-face` rule.
 *
 * @param atRule - The {@link AtRule} to transform.
 * @param family - Font family.
 * @param src - File path, the format is automatically inferred.
 * @param weight - Font weight, automatically inferred if unspecified.
 * @param style - Font style, automatically inferred if unspecified.
 * @param display - Font display, automatically inferred if unspecified.
 *
 * @returns Generated CSS decls.
 *
 * @example
 *   @post fontFace('Roboto', require('fonts/Roboto.ttf'));
 *
 * ```css
 * [at]font-face {
 *   font-family: 'Roboto';
 *   src: url('fonts/Roboto.ttf') format('truetype');
 *   font-style: normal;
 *   font-weight: 400;
 *   font-display: auto;
 * }
 * ```
 */
export default function(atRule: AtRule, family: string, src: string, weight?: FontWeight, style?: FontStyle, display?: FontDisplay) {
  atRule.name = 'font-face'
  atRule.params = ''
  atRule.raws.afterName = ''

  const decls = []
  decls.push(new Declaration({ prop: 'font-family', value: family }))
  decls.push(new Declaration({ prop: 'src', value: `url('${src}') format('${getFontFormatFromPath(src)}')` }))
  decls.push(new Declaration({ prop: 'font-style', value: style || getFontStyleFromPath(src) }))
  decls.push(new Declaration({ prop: 'font-weight', value: String(weight || getFontWeightFromPath(src)) }))
  decls.push(new Declaration({ prop: 'font-display', value: display || 'auto' }))

  atRule.append(...decls)
}

/**
 * Infers the font format from a font file extension. Supported extensions include: `eot`, `woff2`,
 * `woff`, `ttf`, `otf`, `svg`.
 *
 * @param path - The path of the font file.
 *
 * @returns The font format. Defaults to `opentype` if unable to infer.
 */
function getFontFormatFromPath(path: string): FontFormat {
  const ext = path.split('.').pop()

  if (!ext) return 'opentype'

  if (ext.startsWith('eot')) {
    return 'eot'
  }
  else if (ext.startsWith('woff2')) {
    return 'woff2'
  }
  else if (ext.startsWith('woff')) {
    return 'woff'
  }
  else if (ext.startsWith('ttf')) {
    return 'truetype'
  }
  else if (ext.startsWith('otf')) {
    return 'opentype'
  }
  else if (ext.startsWith('svg')) {
    return 'svg'
  }

  return 'opentype'
}

/**
 * Infers the font style from a font file path. Supports `italic` and `oblique`.
 *
 * @param path - Path of the font file.
 *
 * @returns The font style of the font file. Defaults to `normal` if unable to infer.
 */
function getFontStyleFromPath(path: string): FontStyle {
  const basename = path.split('/').pop()

  if (!basename) return 'normal'

  if (~basename.search(/italic/i)) {
    return 'italic'
  }
  else if (~basename.search(/oblique/i)) {
    return 'oblique'
  }
  else {
    return 'normal'
  }
}

/**
 * Infers the font weight from a font file path.
 *
 * @param path - Path of the font file.
 *
 * @returns The font weight of the font file. Defaults to normal (400).
 */
function getFontWeightFromPath(path: string): FontWeight {
  const basename = path.split('/').pop()

  if (!basename) return 'normal'

  if (~basename.search(/thin/i)) {
    return FONT_WEIGHTS.thin
  }
  else if (~basename.search(/extralight/i)) {
    return FONT_WEIGHTS.extraLight
  }
  else if (~basename.search(/light/i)) {
    return FONT_WEIGHTS.light
  }
  else if (~basename.search(/regular/i) || ~basename.search(/normal/i)) {
    return FONT_WEIGHTS.normal
  }
  else if (~basename.search(/medium/i)) {
    return FONT_WEIGHTS.medium
  }
  else if (~basename.search(/semibold/i)) {
    return FONT_WEIGHTS.semiBold
  }
  else if (~basename.search(/extrabold/i)) {
    return FONT_WEIGHTS.extraBold
  }
  else if (~basename.search(/bold/i)) {
    return FONT_WEIGHTS.bold
  }
  else if (~basename.search(/black/i)) {
    return FONT_WEIGHTS.black
  }
  else {
    return FONT_WEIGHTS.normal
  }
}
