import assert from 'assert'
import { AtRule, Declaration } from 'postcss'

/**
 * Sets the max size of the target selector.
 *
 * @param node - The {@link AtRule} or {@link Declaration} to transform.
 * @param args - A minimum of 1 to a maximum of 2 arguments:
 *               1. The max width
 *               2. The max height (defaults to the max width)
 */
export default function(node: AtRule | Declaration, ...args: string[]) {
  assert(args.length >= 1 && args.length <= 2, 'This method must accept 1..2 arguments')

  const width = args.shift()
  const height = args[0] === undefined ? width : args.shift()

  const decls = []

  if (width !== '_') decls.push({ prop: 'max-width', value: width, source: node.source })
  if (height !== '_') decls.push({ prop: 'max-height', value: height, source: node.source })

  node.replaceWith(...decls)
}
