import { AtRule, Declaration } from 'postcss'

/**
 * Makes a video fill the parent.
 *
 * @param node - The {@link AtRule} or {@link Declaration} to transform.
 */
export default function(node: AtRule | Declaration) {
  const decls = []
  decls.push({ prop: 'left', value: '50%', source: node.source })
  decls.push({ prop: 'top', value: '50%', source: node.source })
  decls.push({ prop: 'position', value: 'absolute', source: node.source })
  decls.push({ prop: 'min-width', value: '100%', source: node.source })
  decls.push({ prop: 'min-height', value: '100%', source: node.source })
  decls.push({ prop: 'transform', value: 'translate3d(-50%, -50%, 0)', source: node.source })

  node.replaceWith(...decls)
}
