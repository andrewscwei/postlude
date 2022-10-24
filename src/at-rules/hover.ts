import assert from 'assert'
import postcss, { AtRule, Rule } from 'postcss'

/**
 * Selector for hover state in a non-touch device.
 *
 * @param atRule - The {@link AtRule} to transform.
 */
export default function(atRule: AtRule) {
  assert(atRule.parent?.type === 'rule' || atRule.parent?.type === 'atrule', 'No selector found')
  assert(atRule.parent?.parent, 'No parent container found')

  const parent = atRule.parent as Rule

  const rule = postcss.rule({ selector: `html:not(.touch) ${parent.selector}:hover`, source: atRule.source })
  rule.append(atRule.nodes)

  parent.parent?.insertAfter(parent, rule)

  atRule.remove()
}
