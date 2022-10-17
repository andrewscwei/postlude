import { Declaration } from 'postcss'

/**
 * Sets the overflow of the target selector.
 *
 * @param decl - The {@link Declaration} to transform.
 * @param overflowX - Specifies the overflow-x property.
 * @param overflowY - Specifies the overflow-y property. If unspecified the `overflowX` param will
 *                    be used.
 */
export default function(decl: Declaration, overflowX: string, overflowY?: string) {
  const x = overflowX
  const y = overflowY === undefined ? x : overflowY
  const rules = []

  if (x !== '_') rules.push({ prop: 'overflow-x', value: x, source: decl.source })
  if (y !== '_') rules.push({ prop: 'overflow-y', value: y, source: decl.source })

  decl.replaceWith(...rules)
}
