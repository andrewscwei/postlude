import postcss, { AtRule, Declaration } from 'postcss'

/**
 * Clearfix hack to apply to the target selector for floated elements.
 *
 * @param node - The {@link AtRule} or {@link Declaration} to transform.
 * @param isEnabled - Specifies whether the rule is enabled.
 */
export default function clearfix(node: AtRule | Declaration, isEnabled = true) {
  if (!isEnabled) return

  const beforeRule = postcss.rule({ selector: '&::before' })
  beforeRule.append({ prop: 'content', value: '\'\'', source: node.source })
  beforeRule.append({ prop: 'display', value: 'table', source: node.source })

  const afterRule = postcss.rule({ selector: '&::after' })
  afterRule.append({ prop: 'content', value: '\'\'', source: node.source })
  afterRule.append({ prop: 'display', value: 'table', source: node.source })
  afterRule.append({ prop: 'clear', value: 'both', source: node.source })

  node.replaceWith({ prop: '*zoom', value: '1', source: node.source }, beforeRule, afterRule)
}
