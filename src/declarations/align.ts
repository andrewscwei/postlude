import { AtRule, Declaration } from 'postcss'

/**
 * Aligns an element horizontally and vertically to its parent.
 *
 * @param node - The {@link AtRule} or {@link Declaration} to transform.
 * @param args - A minimum of 1 to a maximum of 3 arguments, order does not
 *               matter:
 *               1. Horizontal alignment: `left`, `right` or `center` (default)
 *               2. Vertical alignment: `top`, `bottom` or `center` (default)
 *               3. Position rule: `fixed` or `absolute` (default)
 */
export default function(node: AtRule | Declaration, ...args: string[]) {
  const alignH = args.includes('left') && 'left' || args.includes('right') && 'right' || 'center'
  const alignV = args.includes('top') && 'top' || args.includes('bottom') && 'bottom' || 'center'
  const position = args.includes('fixed') && 'fixed' || 'absolute'
  const decls = []

  switch (alignH) {
    case 'left':
      decls.push({ prop: 'left', value: 0, source: node.source })
      break
    case 'right':
      decls.push({ prop: 'right', value: 0, source: node.source })
      break
    default:
      decls.push({ prop: 'left', value: 0, source: node.source })
      decls.push({ prop: 'right', value: 0, source: node.source })
      decls.push({ prop: 'margin-left', value: 'auto', source: node.source })
      decls.push({ prop: 'margin-right', value: 'auto', source: node.source })
  }

  switch (alignV) {
    case 'top':
      decls.push({ prop: 'top', value: 0, source: node.source })
      break
    case 'bottom':
      decls.push({ prop: 'bottom', value: 0, source: node.source })
      break
    default:
      decls.push({ prop: 'top', value: 0, source: node.source })
      decls.push({ prop: 'bottom', value: 0, source: node.source })
      decls.push({ prop: 'margin-top', value: 'auto', source: node.source })
      decls.push({ prop: 'margin-bottom', value: 'auto', source: node.source })
  }

  decls.push({ prop: 'position', value: position, source: node.source })

  node.replaceWith(...decls)
}
