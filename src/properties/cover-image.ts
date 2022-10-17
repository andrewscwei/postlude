import { Declaration } from 'postcss'

/**
 * Makes an image fill the parent block. Note that this mixin doesn't support all browsers.
 *
 * @param decl - The {@link Declaration} to transform.
 *
 * @see {@link http://caniuse.com/#feat=object-fit}
 */
export default function(decl: Declaration) {
  const rules = []
  rules.push({ prop: 'width', value: '100%', source: decl.source })
  rules.push({ prop: 'height', value: '100%', source: decl.source })
  rules.push({ prop: 'object-fit', value: 'cover', source: decl.source })

  decl.replaceWith(...rules)
}
