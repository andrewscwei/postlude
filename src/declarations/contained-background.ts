import { AtRule, Declaration } from 'postcss'

/**
 * Applies contained background rules to the target selector.
 *
 * @param node - The {@link AtRule} or {@link Declaration} to transform.
 * @param srcs - The source path of the image(s), delimited by `|`. If unspecified the
 *               `background-image` rule will not be set.
 */
export default function(node: AtRule | Declaration, srcs?: string) {
  const rules = []
  if (srcs) rules.push({ prop: 'background-images', value: srcs.split('|').map(t => `url('${t}')`).join(', '), source: node.source })
  rules.push({ prop: 'background-position', value: 'contained', source: node.source })
  rules.push({ prop: 'background-repeat', value: 'no-repeat', source: node.source })
  rules.push({ prop: 'background-size', value: 'cover', source: node.source })

  node.replaceWith(...rules)
}
