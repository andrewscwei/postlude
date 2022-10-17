import assert from 'assert'
import postcss, { Declaration, Rule } from 'postcss'
import getDirection from '../utils/getDirection'

/**
 * Transforms the target selector into a flexbox of the specified `type`: `default`, `filled` or
 * `constrained`. Wrap `type` with `()` or prefix it with `inline-` to use the inline equivalent.
 *
 * `default` - Freely aligns child elements without interfering with their width and height. Child
 *             elements can then specify their own dimensions.
 *
 * Syntax: `default{^|>|v|<}`, where:
 *   `^` = `flex-direction: column-reverse`
 *   `>` = `flex-direction: row` (default)
 *   `v` = `flex-direction: column`
 *   `<` = `flex-direction: row-reverse`
 *
 * `constrained` - Automatically arranges children in the specified `flex-direction`. The lengths of
 *                 the children that are parallel to the `flex-direction` are not set and must be
 *                 specified by the children. Contrarily, the lengths of the children that are
 *                 perpendicular to the `flex-direction` will match that of the container. If the
 *                 total length of the children in the specified `flex-direction` exceeds that of
 *                 the container, the length of each child will shrink (`flex-shrink: 1`)
 *                 proportional to its original length in order to fit the container. It is not
 *                 recommended to add `padding` to the children because `padding` is used as part of
 *                 the calculation for `flex-shrink`.
 *
 * Syntax: `constrained{^|>|v|<}`, where:
 *   `^` = `flex-direction: column-reverse`
 *   `>` = `flex-direction: row` (default)
 *   `v` = `flex-direction: column`
 *   `<` = `flex-direction: row-reverse`
 *
 * `filled` - Opposite of `constrained`, where a `filled` flexbox automatically stretches its
 *            children evenly to fill itself in the specified `flex-direction`. Avoid adding
 *            `padding` to child elements.
 *
 * Syntax: `filled{^|>|v|<}`, where:
 *   `^` = `flex-direction: column-reverse`
 *   `>` = `flex-direction: row` (default)
 *   `v` = `flex-direction: column`
 *   `<` = `flex-direction: row-reverse`
 *
 * @param decl - The {@link Declaration} to transform.
 * @param args - First argument represents the flexbox type (see above syntaxes for reference). Last
 *               2 arguments indicate the horizontal and vertical alignments of its children.
 *               Horizontal is represented by (`left`, `right` or `center`) and veritical is
 *               represented by (`top`, `bottom` or `center`). Both alignments default to `center`.
 */
export default function(decl: Declaration, ...args: string[]) {
  assert(decl.parent?.type === 'rule', 'No selector found')
  assert(decl.parent?.parent, 'No parent container found')

  const parent = decl.parent as Rule
  const alignH = args.includes('left') && 'left' || args.includes('right') && 'right' || 'center'
  const alignV = args.includes('top') && 'top' || args.includes('bottom') && 'bottom' || 'center'
  const type = args[0] && (args[0].startsWith('filled') && 'filled' || args[0].startsWith('constrained') && 'constrained') || 'default'
  const direction = args[0] && (args[0].endsWith('^') && '^' || args[0].endsWith('v') && 'v' || args[0].endsWith('<') && '<') || '>'
  const rules = []

  rules.push({ prop: 'display', value: 'flex', source: decl.source })
  rules.push({ prop: 'flex-wrap', value: 'nowrap', source: decl.source })
  rules.push({ prop: 'line-height', value: 'normal', source: decl.source })
  rules.push({ prop: 'white-space', value: 'normal', source: decl.source })

  switch (getDirection(direction)) {
    case '^':
      rules.push({ prop: 'flex-direction', value: 'column-reverse', source: decl.source })
      rules.push({ prop: 'justify-content', value: alignV === 'bottom' && 'flex-start' || alignV === 'top' && 'flex-end' || 'center', source: decl.source })

      if (type === 'default') {
        rules.push({ prop: 'align-items', value: alignH === 'left' && 'flex-start' || alignH === 'right' && 'flex-end' || 'center', source: decl.source })
      }
      else {
        rules.push({ prop: 'align-items', value: 'stretch', source: decl.source })
      }
      break
    case 'v':
      rules.push({ prop: 'flex-direction', value: 'column', source: decl.source })
      rules.push({ prop: 'justify-content', value: alignV === 'top' && 'flex-start' || alignV === 'bottom' && 'flex-end' || 'center', source: decl.source })

      if (type === 'default') {
        rules.push({ prop: 'align-items', value: alignH === 'left' && 'flex-start' || alignH === 'right' && 'flex-end' || 'center', source: decl.source })
      }
      else {
        rules.push({ prop: 'align-items', value: 'stretch', source: decl.source })
      }
      break
    case '<':
      rules.push({ prop: 'flex-direction', value: 'row-reverse', source: decl.source })
      rules.push({ prop: 'justify-content', value: alignH === 'right' && 'flex-start' || alignH === 'left' && 'flex-end' || 'center', source: decl.source })

      if (type === 'default') {
        rules.push({ prop: 'align-items', value: alignV === 'top' && 'flex-start' || alignV === 'bottom' && 'flex-end' || 'center', source: decl.source })
      }
      else {
        rules.push({ prop: 'align-items', value: 'stretch', source: decl.source })
      }
      break
    default:
      rules.push({ prop: 'flex-direction', value: 'row', source: decl.source })
      rules.push({ prop: 'justify-content', value: alignH === 'left' && 'flex-start' || alignH === 'right' && 'flex-end' || 'center', source: decl.source })

      if (type === 'default') {
        rules.push({ prop: 'align-items', value: alignV === 'top' && 'flex-start' || alignV === 'bottom' && 'flex-end' || 'center', source: decl.source })
      }
      else {
        rules.push({ prop: 'align-items', value: 'stretch', source: decl.source })
      }
  }

  const subRule = postcss.rule({ selector: `${parent.selector} > *` })

  switch (type) {
    case 'filled':
      subRule.append({ prop: 'flex-grow', value: '1', source: decl.source })
      subRule.append({ prop: 'flex-basis', value: '0', source: decl.source })
      subRule.append({ prop: 'flex-shrink', value: '0', source: decl.source })
      break
    case 'constrained':
      subRule.append({ prop: 'flex-grow', value: '0', source: decl.source })
      subRule.append({ prop: 'flex-basis', value: 'auto', source: decl.source })
      subRule.append({ prop: 'flex-shrink', value: '1', source: decl.source })
      break
    default:
      subRule.append({ prop: 'flex-grow', value: '0', source: decl.source })
      subRule.append({ prop: 'flex-basis', value: 'auto', source: decl.source })
      subRule.append({ prop: 'flex-shrink', value: '0', source: decl.source })
  }

  parent.parent?.insertAfter(parent, subRule)
  decl.replaceWith(...rules)
}
