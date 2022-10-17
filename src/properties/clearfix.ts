import assert from 'assert'
import postcss, { Declaration, Rule } from 'postcss'

/**
 * Clearfix hack for floated elements.
 *
 * @param decl - The {@link Declaration} to transform.
 * @param enable - Specifies whether the rule is enabled.
 */
export default function clearfix(decl: Declaration, enable = true) {
  if (!enable) return

  assert(decl.parent?.type === 'rule', 'No selector found')
  assert(decl.parent?.parent, 'No parent container found')

  const parent = decl.parent as Rule

  const beforeRule = postcss.rule({ selector: `${parent.selector}::before` })
  beforeRule.append({ prop: 'content', value: '\'\'', source: decl.source })
  beforeRule.append({ prop: 'display', value: 'table', source: decl.source })

  const afterRule = postcss.rule({ selector: `${parent.selector}::after` })
  afterRule.append({ prop: 'content', value: '\'\'', source: decl.source })
  afterRule.append({ prop: 'display', value: 'table', source: decl.source })
  afterRule.append({ prop: 'clear', value: 'both', source: decl.source })

  parent.parent?.insertAfter(parent, afterRule)
  parent.parent?.insertAfter(parent, beforeRule)

  decl.replaceWith({ prop: '*zoom', value: '1', source: decl.source })
}
