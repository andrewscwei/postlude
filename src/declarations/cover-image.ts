import { AtRule, Declaration } from 'postcss'

/**
 * Makes an image fill the parent. Note that this feature is not supported by all browsers.
 *
 * @param node - The {@link AtRule} or {@link Declaration} to transform.
 *
 * @see {@link http://caniuse.com/#feat=object-fit}
 */
export default function(node: AtRule | Declaration) {
  const rules = []
  rules.push({ prop: 'width', value: '100%', source: node.source })
  rules.push({ prop: 'height', value: '100%', source: node.source })
  rules.push({ prop: 'object-fit', value: 'cover', source: node.source })

  node.replaceWith(...rules)
}
