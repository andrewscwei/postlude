import assert from 'assert'
import postcss, { AtRule, Rule } from 'postcss'
import parseArg from '../utils/parseArg'

/**
 * Transforms an element into a flexbox of the specified `type`:
 *   1. `default` - Freely aligns child elements without interfering with their width and height.
 *                  Child elements can then specify their own dimensions.
 *   2. `constrained` - Automatically arranges children in the specified `flex-direction`. The
 *                      lengths of the children that are parallel to the `flex-direction` are not
 *                      set and must be specified by the children. Contrarily, the lengths of the
 *                      children that are perpendicular to the `flex-direction` will match that of
 *                      the container. If the total length of the children in the specified
 *                      `flex-direction` exceeds that of the container, the length of each child
 *                      will shrink (`flex-shrink: 1`) proportional to its original length in order
 *                      to fit the container. It is not recommended to add `padding` to the children
 *                      because `padding` is used as part of the calculation for `flex-shrink`.
 *   3. `filled` - Opposite of `constrained`, where a `filled` flexbox automatically stretches its
 *                 children evenly to fill itself in the specified `flex-direction`. Avoid adding
 *                 `padding` to child elements.
 *
 * Syntax: `{type} {direction} {horizontal_align} {vertical_align} {inline}`
 *
 * @param atRule - The {@link AtRule} to transform.
 * @param args - A minimum of 0 to a maximum of inline arguments, order doesn't matter.
 *               1. Box type (i.e. `default`, `constrained`, `filled`), the default is `default`
 *               2. Child alignment direction (i.e. `row` (default), `column`, `row-reverse`,
 *                 `column-reverse`)
 *               3. Horizontal alignment of child elements: `left`, `right` or `center` (default)
 *               4. Vertical alignment of child elements: `top`, `bottom` or `center` (default)
 *               5. Either a literal string "inline" or left unspecified, indicates if the flexbox
 *                  is inline, defaults to not inline
 */
export default function(atRule: AtRule, ...args: string[]) {
  assert(atRule.parent?.type === 'rule', 'No selector found')
  assert(atRule.parent?.parent, 'No parent container found')

  const parent = atRule.parent as Rule
  const alignH = parseArg(args, ['left', 'right'], 'center')
  const alignV = parseArg(args, ['top', 'bottom'], 'center')
  const type = parseArg(args, ['filled', 'constrained'], 'default')
  const direction = parseArg(args, ['row', 'column', 'row-reverse', 'column-reverse'], 'row')
  const isInline = parseArg(args, ['inline']) !== undefined
  const rules = []

  rules.push({ prop: 'display', value: isInline ? 'inline-flex' : 'flex', source: atRule.source })
  rules.push({ prop: 'flex-wrap', value: 'nowrap', source: atRule.source })
  rules.push({ prop: 'line-height', value: 'normal', source: atRule.source })
  rules.push({ prop: 'white-space', value: 'normal', source: atRule.source })

  switch (direction) {
    case 'column-reverse':
      rules.push({ prop: 'flex-direction', value: 'column-reverse', source: atRule.source })
      rules.push({ prop: 'justify-content', value: alignV === 'bottom' && 'flex-start' || alignV === 'top' && 'flex-end' || 'center', source: atRule.source })

      if (type === 'default') {
        rules.push({ prop: 'align-items', value: alignH === 'left' && 'flex-start' || alignH === 'right' && 'flex-end' || 'center', source: atRule.source })
      }
      else {
        rules.push({ prop: 'align-items', value: 'stretch', source: atRule.source })
      }
      break
    case 'column':
      rules.push({ prop: 'flex-direction', value: 'column', source: atRule.source })
      rules.push({ prop: 'justify-content', value: alignV === 'top' && 'flex-start' || alignV === 'bottom' && 'flex-end' || 'center', source: atRule.source })

      if (type === 'default') {
        rules.push({ prop: 'align-items', value: alignH === 'left' && 'flex-start' || alignH === 'right' && 'flex-end' || 'center', source: atRule.source })
      }
      else {
        rules.push({ prop: 'align-items', value: 'stretch', source: atRule.source })
      }
      break
    case 'row-reverse':
      rules.push({ prop: 'flex-direction', value: 'row-reverse', source: atRule.source })
      rules.push({ prop: 'justify-content', value: alignH === 'right' && 'flex-start' || alignH === 'left' && 'flex-end' || 'center', source: atRule.source })

      if (type === 'default') {
        rules.push({ prop: 'align-items', value: alignV === 'top' && 'flex-start' || alignV === 'bottom' && 'flex-end' || 'center', source: atRule.source })
      }
      else {
        rules.push({ prop: 'align-items', value: 'stretch', source: atRule.source })
      }
      break
    default:
      rules.push({ prop: 'flex-direction', value: 'row', source: atRule.source })
      rules.push({ prop: 'justify-content', value: alignH === 'left' && 'flex-start' || alignH === 'right' && 'flex-end' || 'center', source: atRule.source })

      if (type === 'default') {
        rules.push({ prop: 'align-items', value: alignV === 'top' && 'flex-start' || alignV === 'bottom' && 'flex-end' || 'center', source: atRule.source })
      }
      else {
        rules.push({ prop: 'align-items', value: 'stretch', source: atRule.source })
      }
  }

  const subRule = postcss.rule({ selector: `${parent.selector} > *` })

  switch (type) {
    case 'filled':
      subRule.append({ prop: 'flex-grow', value: '1', source: atRule.source })
      subRule.append({ prop: 'flex-basis', value: '0', source: atRule.source })
      subRule.append({ prop: 'flex-shrink', value: '0', source: atRule.source })
      break
    case 'constrained':
      subRule.append({ prop: 'flex-grow', value: '0', source: atRule.source })
      subRule.append({ prop: 'flex-basis', value: 'auto', source: atRule.source })
      subRule.append({ prop: 'flex-shrink', value: '1', source: atRule.source })
      break
    default:
      subRule.append({ prop: 'flex-grow', value: '0', source: atRule.source })
      subRule.append({ prop: 'flex-basis', value: 'auto', source: atRule.source })
      subRule.append({ prop: 'flex-shrink', value: '0', source: atRule.source })
  }

  parent.parent?.insertAfter(parent, subRule)
  atRule.replaceWith(...rules)
}
