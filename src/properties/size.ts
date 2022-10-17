import assert from 'assert'
import { Declaration } from 'postcss'
import valueParser from 'postcss-value-parser'
import isBool from '../utils/isBool'

/**
 * Sets the size of the target selector.
 *
 * @param decl - The {@link Declaration} to transform.
 * @param args - First argument indicates the width. Second argument indicates the height. If
 *               unspecified, the width will be used as the height. The third and last argument
 *               indicates whether the selector is an oval by applying border-radius that is half of
 *               its smallest edge.
 */
export default function(decl: Declaration, ...args: string[]) {
  assert(args.length >= 1 && args.length <= 3, 'This method must accept 1..3 arguments')
  assert(!isBool(args[0]), 'First argument must be the width')

  const width = args.shift()
  const height = isBool(args[0]) || args[0] === undefined ? width : args.shift()
  const isOval = isBool(args[0]) ? args[0] : false

  const rules = []

  if (width !== '_') rules.push({ prop: 'width', value: width, source: decl.source })
  if (height !== '_') rules.push({ prop: 'height', value: height, source: decl.source })
  if (isOval) {
    const w = valueParser.unit(width ?? '')
    const h = valueParser.unit(height ?? '')
    let diameter

    if (w === false && h !== false) {
      diameter = h
    }
    else if (w !== false && h === false) {
      diameter = h
    }
    else if (w === false && h === false) {
      diameter = undefined
    }
    else if (w !== false && h !== false && Number(w.number) >= Number(h.number)) {
      diameter = h
    }
    else if (w !== false && h !== false && Number(w.number) < Number(h.number)) {
      diameter = w
    }

    if (diameter) {
      rules.push({ prop: 'border-radius', value: `${Number(diameter.number) / 2}${diameter.unit}`, source: decl.source })
      rules.push({ prop: 'overflow', value: 'hidden', source: decl.source })
    }
  }

  decl.replaceWith(...rules)
}
