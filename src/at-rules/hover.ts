import { AtRule } from 'postcss'

/**
 * Selector for hover state in a non-touch device.
 *
 * @param atRule - The {@link AtRule} to transform.
 *
 * @requires postcss-nesting
 */
export default function(atRule: AtRule) {
  atRule.name = 'nested'
  atRule.params = 'html:not([data-touch=true]) &:hover'
}
