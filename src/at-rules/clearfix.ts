import postcss, { AtRule } from 'postcss'

/**
 * Clearfix hack to apply to the target selector for floated elements.
 *
 * @param atRule - The {@link AtRule} to transform.
 *
 * @requires postcss-nesting
 */
export default function(atRule: AtRule) {
  const beforeRule = postcss.rule({ selector: '&::before' })
  beforeRule.append({ prop: 'content', value: '\'\'', source: atRule.source })
  beforeRule.append({ prop: 'display', value: 'table', source: atRule.source })

  const afterRule = postcss.rule({ selector: '&::after' })
  afterRule.append({ prop: 'content', value: '\'\'', source: atRule.source })
  afterRule.append({ prop: 'display', value: 'table', source: atRule.source })
  afterRule.append({ prop: 'clear', value: 'both', source: atRule.source })

  atRule.replaceWith({ prop: '*zoom', value: '1', source: atRule.source }, beforeRule, afterRule)
}
