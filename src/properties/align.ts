import { Declaration } from 'postcss'

/**
 * Aligns an element horizontally and vertically.
 *
 * @param decl - The {@link Declaration} to transform.
 * @param args - First two arguments represent the horizontal (`left`, `right` or `center`) and
 *               veritical (`top`, `bottom` or `center`) alignment (both default to `center`. The
 *               third argument indicates the position type (`absolute` or `fixed`).
 */
export default function(decl: Declaration, ...args: string[]) {
  const alignH = args.includes('left') && 'left' || args.includes('right') && 'right' || 'center'
  const alignV = args.includes('top') && 'top' || args.includes('bottom') && 'bottom' || 'center'
  const position = args.includes('fixed') && 'fixed' || 'absolute'
  const rules = []

  switch (alignH) {
    case 'left':
      rules.push({ prop: 'left', value: 0, source: decl.source })
      break
    case 'right':
      rules.push({ prop: 'right', value: 0, source: decl.source })
      break
    default:
      rules.push({ prop: 'left', value: 0, source: decl.source })
      rules.push({ prop: 'right', value: 0, source: decl.source })
      rules.push({ prop: 'margin-left', value: 'auto', source: decl.source })
      rules.push({ prop: 'margin-right', value: 'auto', source: decl.source })
  }

  switch (alignV) {
    case 'top':
      rules.push({ prop: 'top', value: 0, source: decl.source })
      break
    case 'bottom':
      rules.push({ prop: 'bottom', value: 0, source: decl.source })
      break
    default:
      rules.push({ prop: 'top', value: 0, source: decl.source })
      rules.push({ prop: 'bottom', value: 0, source: decl.source })
      rules.push({ prop: 'margin-top', value: 'auto', source: decl.source })
      rules.push({ prop: 'margin-bottom', value: 'auto', source: decl.source })
  }

  rules.push({ prop: 'position', value: position, source: decl.source })

  decl.replaceWith(...rules)
}
