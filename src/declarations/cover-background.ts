import { AtRule, Declaration } from 'postcss'

/**
 * Applies cover background decls to the target selector.
 *
 * @param node - The {@link AtRule} or {@link Declaration} to transform.
 * @param srcs - The source path of the image(s), delimited by `|`. If unspecified the
 *               `background-image` rule will not be set.
 */
export default function(node: AtRule | Declaration, srcs?: string) {
  const decls = []
  if (srcs) decls.push({ prop: 'background-image', value: srcs.split('|').map(t => `url('${t}')`).join(', '), source: node.source })
  decls.push({ prop: 'background-position', value: 'center', source: node.source })
  decls.push({ prop: 'background-repeat', value: 'no-repeat', source: node.source })
  decls.push({ prop: 'background-size', value: 'cover', source: node.source })

  node.replaceWith(...decls)
}
