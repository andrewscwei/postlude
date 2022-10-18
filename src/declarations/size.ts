import assert from 'assert'
import { AtRule, Declaration } from 'postcss'
import valueParser from 'postcss-value-parser'
import isBool from '../utils/isBool'

/**
 * Sets the size of the target selector.
 *
 * @param node - The {@link AtRule} or {@link Declaration} to transform.
 * @param args - A minimum of 1 to a maximum of 3 arguments:
 *               1. The width
 *               2. The height (defaults to the width)
 *               3. Indicates whether the selector is an oval by applying `border-radius` rule that
 *                  is half of its smallest edge.
 */
export default function(node: AtRule | Declaration, ...args: string[]) {
  assert(args.length >= 1 && args.length <= 3, 'This method must accept 1..3 arguments')
  assert(!isBool(args[0]), 'First argument must be the width')

  const width = args.shift()
  const height = isBool(args[0]) || args[0] === undefined ? width : args.shift()
  const isOval = isBool(args[0]) ? args[0] : false

  const rules = []

  if (width !== '_') rules.push({ prop: 'width', value: width, source: node.source })
  if (height !== '_') rules.push({ prop: 'height', value: height, source: node.source })
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
      rules.push({ prop: 'border-radius', value: `${Number(diameter.number) / 2}${diameter.unit}`, source: node.source })
      rules.push({ prop: 'overflow', value: 'hidden', source: node.source })
    }
  }

  node.replaceWith(...rules)
}
