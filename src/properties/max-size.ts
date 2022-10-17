import assert from 'assert'
import { Declaration } from 'postcss'

/**
 * Sets the max size of the target selector.
 *
 * @param decl - The {@link Declaration} to transform.
 * @param args - First argument indicates the width. Second argument indicates the height. If
 *               unspecified, the width will be used as the height. The third and last argument
 *               indicates whether the selector is an oval by applying border-radius that is half of
 *               its smallest edge.
 */
export default function(decl: Declaration, ...args: string[]) {
  assert(args.length >= 1 && args.length <= 2, 'This method must accept 1..2 arguments')

  const width = args.shift()
  const height = args[0] === undefined ? width : args.shift()

  const rules = []

  if (width !== '_') rules.push({ prop: 'max-width', value: width, source: decl.source })
  if (height !== '_') rules.push({ prop: 'max-height', value: height, source: decl.source })

  decl.replaceWith(...rules)
}
