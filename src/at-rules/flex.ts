import { AtRule, Rule } from 'postcss'
import parseArg from '../utils/parseArg'

/**
 * Transforms an element into a flexbox of the specified `fillType`:
 *   1. `undefined` - Default `fillType`. Freely aligns child elements without interfering with
 *                    their width and height. Child elements can then specify their own dimensions.
 *   2. `constrain` - Automatically arranges children in the specified `flex-direction`. The lengths
 *                    of the children that are parallel to the `flex-direction` are not set and must
 *                    be specified by the children. Contrarily, the lengths of the children that are
 *                    perpendicular to the `flex-direction` will match that of the container. If the
 *                    total length of the children in the specified `flex-direction` exceeds that of
 *                    the container, the length of each child will shrink (`flex-shrink: 1`)
 *                    proportional to its original length in order to fit the container. It is not
 *                    recommended to add `padding` to the children because `padding` is used as part
 *                    of the calculation for `flex-shrink`.
 *   3. `fill` - Opposite of `constrain`, where a `fill` flexbox automatically stretches its
 *               children evenly to fill itself in the specified `flex-direction`. Avoid adding
 *               `padding` to child elements.
 *
 * Syntax: `{fill_type} {direction} {horizontal_align} {vertical_align} {inline} {reverse}`
 *
 * @param atRule - The {@link AtRule} to transform.
 * @param args - A minimum of 0 to a maximum of 6 arguments, order doesn't matter:
 *               1. Optional fill type (i.e. `constrain`, `fill`)
 *               2. Child alignment direction (i.e. `horizontal` (default) or `vertical`
 *               3. Horizontal alignment of child elements: `left`, `right` or `center` (default)
 *               4. Vertical alignment of child elements: `top`, `bottom` or `center` (default)
 *               5. Either a string literal "inline" or unspecified, indicates if the flexbox is
 *                  inline, defaults to not inline
 *               6. Either a string literal "reverse" or unspecified, indicates if the flexbox
 *                  direction is reversed
 *
 * @requires postcss-nesting
 */
export default function(atRule: AtRule, ...args: string[]) {
  const alignH = parseArg(args, ['left', 'right'], 'center')
  const alignV = parseArg(args, ['top', 'bottom'], 'center')
  const fillType = parseArg(args, ['fill', 'constrain'])
  const direction = parseArg(args, ['horizontal', 'vertical'], 'horizontal')
  const isInline = parseArg(args, ['inline']) !== undefined
  const isReversed = parseArg(args, ['reverse']) !== undefined
  const decls = []

  decls.push({ prop: 'display', value: isInline ? 'inline-flex' : 'flex', source: atRule.source })
  decls.push({ prop: 'flex-wrap', value: 'nowrap', source: atRule.source })
  decls.push({ prop: 'line-height', value: 'normal', source: atRule.source })
  decls.push({ prop: 'white-space', value: 'normal', source: atRule.source })

  switch (direction) {
    case 'vertical':
      if (isReversed) {
        decls.push({ prop: 'flex-direction', value: 'column-reverse', source: atRule.source })
        decls.push({ prop: 'justify-content', value: alignV === 'bottom' && 'flex-start' || alignV === 'top' && 'flex-end' || 'center', source: atRule.source })

        if (fillType) {
          decls.push({ prop: 'align-items', value: 'stretch', source: atRule.source })
        }
        else {
          decls.push({ prop: 'align-items', value: alignH === 'left' && 'flex-start' || alignH === 'right' && 'flex-end' || 'center', source: atRule.source })
        }
      }
      else {
        decls.push({ prop: 'flex-direction', value: 'column', source: atRule.source })
        decls.push({ prop: 'justify-content', value: alignV === 'top' && 'flex-start' || alignV === 'bottom' && 'flex-end' || 'center', source: atRule.source })

        if (fillType) {
          decls.push({ prop: 'align-items', value: 'stretch', source: atRule.source })
        }
        else {
          decls.push({ prop: 'align-items', value: alignH === 'left' && 'flex-start' || alignH === 'right' && 'flex-end' || 'center', source: atRule.source })
        }
      }
      break
    case 'horizontal':
    default:
      if (isReversed) {
        decls.push({ prop: 'flex-direction', value: 'row-reverse', source: atRule.source })
        decls.push({ prop: 'justify-content', value: alignH === 'right' && 'flex-start' || alignH === 'left' && 'flex-end' || 'center', source: atRule.source })

        if (fillType) {
          decls.push({ prop: 'align-items', value: 'stretch', source: atRule.source })
        }
        else {
          decls.push({ prop: 'align-items', value: alignV === 'top' && 'flex-start' || alignV === 'bottom' && 'flex-end' || 'center', source: atRule.source })
        }
      }
      else {
        decls.push({ prop: 'flex-direction', value: 'row', source: atRule.source })
        decls.push({ prop: 'justify-content', value: alignH === 'left' && 'flex-start' || alignH === 'right' && 'flex-end' || 'center', source: atRule.source })

        if (fillType) {
          decls.push({ prop: 'align-items', value: 'stretch', source: atRule.source })
        }
        else {
          decls.push({ prop: 'align-items', value: alignV === 'top' && 'flex-start' || alignV === 'bottom' && 'flex-end' || 'center', source: atRule.source })
        }
      }
  }

  const childRule = new Rule({ selector: '& > *' })

  switch (fillType) {
    case 'fill':
      childRule.append({ prop: 'flex-grow', value: '1', source: atRule.source })
      childRule.append({ prop: 'flex-basis', value: '0', source: atRule.source })
      childRule.append({ prop: 'flex-shrink', value: '0', source: atRule.source })
      break
    case 'constrain':
      childRule.append({ prop: 'flex-grow', value: '0', source: atRule.source })
      childRule.append({ prop: 'flex-basis', value: 'auto', source: atRule.source })
      childRule.append({ prop: 'flex-shrink', value: '1', source: atRule.source })
      break
    default:
      childRule.append({ prop: 'flex-grow', value: '0', source: atRule.source })
      childRule.append({ prop: 'flex-basis', value: 'auto', source: atRule.source })
      childRule.append({ prop: 'flex-shrink', value: '0', source: atRule.source })
  }

  atRule.replaceWith(...decls, childRule)
}
