import { AtRule, Declaration } from 'postcss'
import { FontStyle, FontVariant, FontWeight, FONT_WEIGHTS, LetterSpacing, LineHeight } from '../types'

/**
 * Sets the font properties for the target selector.
 *
 * @param node - The {@link AtRule} or {@link Declaration} to transform.
 * @param family - The `font-family` property.
 * @param size - Th `font-size` property.
 * @param weight - The `font-weight` property.
 */
/**
 * Sets the font properties for the target selector. All numbers default to `rem` unit.
 *
 * @param family - Font family.
 * @param size - Font size. If the value specified is a number, the associated unit will be 'rem'.
 * @param weight - Font weight.
 * @param style - Font style.
 * @param lineHeight - Line height. If the value specified is a number, the associated unit will be
 *                     'rem'.
 * @param letterSpacing - Letter spacing. If the value specified is a number, the associated unit
 *                        will be 'rem'.
 * @param variant - Font variant.
 *
 * @example
 *   @post font('Roboto', '16px') // Returns...
 *
 * ```css
 * {
 *   font-family: 'Roboto';
 *   font-size: 16px;
 *   font-style: normal;
 *   font-weight: 400;
 *   font-variant: normal;
 *   line-height: normal;
 *   letter-spacing: normal;
 * }
 * ```
 */
export default function(
  node: AtRule | Declaration,
  family = 'sans-serif',
  size = '1.6rem',
  weight: FontWeight = FONT_WEIGHTS.normal,
  style: FontStyle = 'normal',
  lineHeight: LineHeight = 'normal',
  letterSpacing: LetterSpacing = 'normal',
  variant: FontVariant = 'normal',
) {
  const rules = []
  rules.push({ prop: 'font-family', value: family, source: node.source })
  rules.push({ prop: 'font-size', value: size, source: node.source })
  rules.push({ prop: 'font-weight', value: !isNaN(parseInt(String(weight), 10)) ? weight : FONT_WEIGHTS[weight] ?? FONT_WEIGHTS.normal, source: node.source })
  rules.push({ prop: 'font-style', value: style, source: node.source })
  rules.push({ prop: 'font-variant', value: variant, source: node.source })
  rules.push({ prop: 'line-height', value: lineHeight, source: node.source })
  rules.push({ prop: 'letter-spacing', value: letterSpacing, source: node.source })

  node.replaceWith(...rules)
}
