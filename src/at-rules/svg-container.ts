import { AtRule, Rule } from 'postcss'

/**
 * Normalizes an element containing an `<svg>` markup.
 *
 * @param atRule - The {@link AtRule} to transform.
 *
 * @requires postcss-nesting
 */
export default function(atRule: AtRule) {
  const decls = []
  decls.push({ prop: 'box-sizing', value: 'border-box', source: atRule.source })
  decls.push({ prop: 'display', value: 'inline-block', source: atRule.source })
  decls.push({ prop: 'flex-grow', value: '0', source: atRule.source })
  decls.push({ prop: 'flex-shrink', value: '0', source: atRule.source })
  decls.push({ prop: 'flex-basis', value: '0', source: atRule.source })
  decls.push({ prop: 'height', value: 'auto', source: atRule.source })
  decls.push({ prop: 'position', value: 'relative', source: atRule.source })
  decls.push({ prop: 'width', value: 'auto', source: atRule.source })

  const rule = new Rule({ selector: '& svg', source: atRule.source })
  rule.append({ prop: 'height', value: 'auto', source: atRule.source })
  rule.append({ prop: 'transition-delay', value: 'inherit', source: atRule.source })
  rule.append({ prop: 'transition-duration', value: 'inherit', source: atRule.source })
  rule.append({ prop: 'transition-property', value: 'inherit', source: atRule.source })
  rule.append({ prop: 'transition-timing-function', value: 'inherit', source: atRule.source })
  rule.append({ prop: 'width', value: 'auto', source: atRule.source })

  const subrule = new Rule({ selector: '& *', source: atRule.source })
  subrule.append({ prop: 'transition-delay', value: 'inherit', source: atRule.source })
  subrule.append({ prop: 'transition-duration', value: 'inherit', source: atRule.source })
  subrule.append({ prop: 'transition-property', value: 'inherit', source: atRule.source })
  subrule.append({ prop: 'transition-timing-function', value: 'inherit', source: atRule.source })

  rule.append(subrule)

  atRule.replaceWith(...decls, rule)
}
