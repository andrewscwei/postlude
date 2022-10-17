import { AtRule, Declaration } from 'postcss'

/**
 * Sets the font properties for the target selector.
 *
 * @param node - The {@link AtRule} or {@link Declaration} to transform.
 * @param family - The `font-family` property.
 * @param size - Th `font-size` property.
 * @param weight - The `font-weight` property.
 */
export default function(node: AtRule | Declaration, family: string, size?: string, weight?: string) {
  const rules = []
  if (family) rules.push({ prop: 'font-family', value: family, source: node.source })
  if (size) rules.push({ prop: 'font-size', value: size, source: node.source })
  if (weight) rules.push({ prop: 'font-weight', value: weight, source: node.source })

  node.replaceWith(...rules)
}
