import { Declaration } from 'postcss'

/**
 * Sets the font properties for the target selector.
 *
 * @param decl - The {@link Declaration} to transform.
 * @param family - The `font-family` property.
 * @param size - Th `font-size` property.
 * @param weight - The `font-weight` property.
 */
export default function(decl: Declaration, family: string, size?: string, weight?: string) {
  const rules = []
  if (family) rules.push({ prop: 'font-family', value: family, source: decl.source })
  if (size) rules.push({ prop: 'font-size', value: size, source: decl.source })
  if (weight) rules.push({ prop: 'font-weight', value: weight, source: decl.source })

  decl.replaceWith(...rules)
}
