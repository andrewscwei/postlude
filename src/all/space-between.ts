import assert from 'assert'
import postcss, { AtRule, Declaration, Rule } from 'postcss'
import getDirection from '../utils/getDirection'

/**
 * Sets the space in between adjacent elements excluding the first and last element.
 *
 * @param value - Specifies the value of the gap.
 * @param direction - Specifies the direction. '>', 'horizontal' and 'row' means horizontal. 'v',
 *                    'vertical' and 'column' means vertical.
 */
export default function(node: AtRule | Declaration, value: string, direction = '>') {
  assert(node.parent?.type === 'rule', 'No selector found')
  assert(node.parent?.parent, 'No parent container found')

  const parent = node.parent as Rule
  const rule = postcss.rule({ selector: `${parent.selector}:not(:last-child)` })

  switch (getDirection(direction)) {
    case 'v':
      rule.append({ prop: 'margin-bottom', value, source: node.source })
      break
    case '>':
      rule.append({ prop: 'margin-right', value, source: node.source })
      break
    default:
    // Do nothing.
  }

  parent.parent?.insertAfter(parent, rule)
  node.remove()
}
