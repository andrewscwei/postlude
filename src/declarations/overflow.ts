import { AtRule, Declaration } from 'postcss'

/**
 * Sets the overflow of the target selector.
 *
 * @param node - The {@link AtRule} or {@link Declaration} to transform.
 * @param overflowX - Specifies the overflow-x property.
 * @param overflowY - Specifies the overflow-y property. If unspecified the `overflowX` param will
 *                    be used.
 */
export default function(node: AtRule | Declaration, overflowX: string, overflowY?: string) {
  const x = overflowX
  const y = overflowY === undefined ? x : overflowY
  const rules = []

  if (x !== '_') rules.push({ prop: 'overflow-x', value: x, source: node.source })
  if (y !== '_') rules.push({ prop: 'overflow-y', value: y, source: node.source })

  node.replaceWith(...rules)
}
