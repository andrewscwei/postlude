import { AtRule, Rule } from 'postcss'
import parseArg from '../utils/parseArg'

/**
 * Transforms an element into a container that stacks child elements in a
 * certain direction. The behavior of this at-rule is similar to that of
 * {@link flex}, except you can only specify the alignment of the opposite
 * direction (i.e. if `horizontal` is specified as the direction, then this
 * at-rule only accepts `top`, `center` or `right` as the vertical alignment).
 *
 * Syntax: `{fill_type} {direction} {horizontal_or_vertical_align} {gap}
 * {inline} {reverse}`
 *
 * @param atRule - The {@link AtRule} to transform.
 * @param args - A minimum of 0 to a maximum of 6 arguments, order doesn't
 *               matter:
 *               1. Optional fill type (i.e. `constrain`, `fill`)
 *               2. Child alignment direction (i.e. `horizontal` (default) or
 *                  `vertical`
 *               3. Horizontal or vertical alignment of child elements depending
 *                  on the specified direction (the alignment here is always
 *                  referring to opposite axis of the direction): `top`/`left`,
 *                  `bottom`/`right` or `center` (default)
 *               4, The gap between each child element, defaults to 0
 *               5. Either a string literal "inline" or unspecified, indicates
 *                  if the flexbox is inline, defaults to not inline
 *               6. Either a string literal "reverse" or unspecified, indicates
 *                  if the flexbox direction is reversed
 *
 * @requires postcss-nesting
 */
export default function(atRule: AtRule, ...args: string[]) {
  const direction = parseArg(args, ['horizontal', 'vertical'], 'horizontal')
  const align = parseArg(args, direction === 'horizontal' ? ['left', 'right'] : ['top', 'bottom'], 'center')
  const fillType = parseArg(args, ['fill', 'constrain'])
  const isInline = parseArg(args, ['inline']) !== undefined
  const isReversed = parseArg(args, ['reverse']) !== undefined
  const gap = args.find(t => !isNaN(parseFloat(t))) ?? '0'

  const decls = []
  decls.push({ prop: 'display', value: isInline ? 'inline-flex' : 'flex', source: atRule.source })
  decls.push({ prop: 'flex-wrap', value: 'nowrap', source: atRule.source })
  decls.push({ prop: direction === 'horizontal' ? 'align-items' : 'justify-content', value: 'flex-start', source: atRule.source })
  decls.push({ prop: 'line-height', value: 'normal', source: atRule.source })
  decls.push({ prop: 'white-space', value: 'normal', source: atRule.source })

  switch (direction) {
    case 'vertical':
      if (isReversed) {
        decls.push({ prop: 'flex-direction', value: 'column-reverse', source: atRule.source })

        if (fillType) {
          decls.push({ prop: 'align-items', value: 'stretch', source: atRule.source })
        }
        else {
          decls.push({ prop: 'align-items', value: align === 'left' && 'flex-start' || align === 'right' && 'flex-end' || 'center', source: atRule.source })
        }
      }
      else {
        decls.push({ prop: 'flex-direction', value: 'column', source: atRule.source })

        if (fillType) {
          decls.push({ prop: 'align-items', value: 'stretch', source: atRule.source })
        }
        else {
          decls.push({ prop: 'align-items', value: align === 'left' && 'flex-start' || align === 'right' && 'flex-end' || 'center', source: atRule.source })
        }
      }
      break
    case 'horizontal':
    default:
      if (isReversed) {
        decls.push({ prop: 'flex-direction', value: 'row-reverse', source: atRule.source })

        if (fillType) {
          decls.push({ prop: 'justify-content', value: 'stretch', source: atRule.source })
        }
        else {
          decls.push({ prop: 'justify-content', value: align === 'top' && 'flex-start' || align === 'bottom' && 'flex-end' || 'center', source: atRule.source })
        }
      }
      else {
        decls.push({ prop: 'flex-direction', value: 'row', source: atRule.source })

        if (fillType) {
          decls.push({ prop: 'justify-content', value: 'stretch', source: atRule.source })
        }
        else {
          decls.push({ prop: 'justify-content', value: align === 'top' && 'flex-start' || align === 'bottom' && 'flex-end' || 'center', source: atRule.source })
        }
      }
  }

  const childRule0 = new Rule({ selector: '& > *' })

  switch (fillType) {
    case 'fill':
      childRule0.append({ prop: 'flex-grow', value: '1', source: atRule.source })
      childRule0.append({ prop: 'flex-basis', value: '0', source: atRule.source })
      childRule0.append({ prop: 'flex-shrink', value: '0', source: atRule.source })
      break
    case 'constrain':
      childRule0.append({ prop: 'flex-grow', value: '0', source: atRule.source })
      childRule0.append({ prop: 'flex-basis', value: 'auto', source: atRule.source })
      childRule0.append({ prop: 'flex-shrink', value: '1', source: atRule.source })
      break
    default:
      childRule0.append({ prop: 'flex-grow', value: '0', source: atRule.source })
      childRule0.append({ prop: 'flex-basis', value: 'auto', source: atRule.source })
      childRule0.append({ prop: 'flex-shrink', value: '0', source: atRule.source })
  }

  const childRule1 = new Rule({ selector: '& > *:not(:last-child)', source: atRule.source })

  switch (direction) {
    case 'vertical':
      if (isReversed) {
        childRule1.append({ prop: 'margin-top', value: gap, source: atRule.source })
        childRule1.append({ prop: 'margin-right', value: 'unset', source: atRule.source })
        childRule1.append({ prop: 'margin-bottom', value: 'unset', source: atRule.source })
        childRule1.append({ prop: 'margin-left', value: 'unset', source: atRule.source })
      }
      else {
        childRule1.append({ prop: 'margin-top', value: 'unset', source: atRule.source })
        childRule1.append({ prop: 'margin-right', value: 'unset', source: atRule.source })
        childRule1.append({ prop: 'margin-bottom', value: gap, source: atRule.source })
        childRule1.append({ prop: 'margin-left', value: 'unset', source: atRule.source })
      }
      break
    case 'row':
    default:
      if (isReversed) {
        childRule1.append({ prop: 'margin-top', value: 'unset', source: atRule.source })
        childRule1.append({ prop: 'margin-right', value: 'unset', source: atRule.source })
        childRule1.append({ prop: 'margin-bottom', value: 'unset', source: atRule.source })
        childRule1.append({ prop: 'margin-left', value: gap, source: atRule.source })
      }
      else {
        childRule1.append({ prop: 'margin-top', value: 'unset', source: atRule.source })
        childRule1.append({ prop: 'margin-right', value: gap, source: atRule.source })
        childRule1.append({ prop: 'margin-bottom', value: 'unset', source: atRule.source })
        childRule1.append({ prop: 'margin-left', value: 'unset', source: atRule.source })
      }
  }

  atRule.replaceWith(...decls, childRule0, childRule1)
}
