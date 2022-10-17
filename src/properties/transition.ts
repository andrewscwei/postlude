import { Declaration } from 'postcss'

/**
 * Applies multiple transition rules at once.
 *
 * @param decl - The {@link Declaration} to transform.
 * @param properties - Transition property(ies) delimited by `|`.
 * @param durations - Transition duration(s) delimited by `|`.
 * @param timingFunctions - Transition timing function(s) delimited by `|`.
 * @param delays - Transition delay(s) delimited by `|`.
 */
export default function(decl: Declaration, properties = 'all', durations = '0s', timingFunctions = 'ease', delays = '0s') {
  const rules = []
  rules.push({ prop: 'transition-property', value: properties.split('|').join(', '), source: decl.source })
  rules.push({ prop: 'transition-duration', value: durations.split('|').join(', '), source: decl.source })
  rules.push({ prop: 'transition-timing-function', value: timingFunctions.split('|').join(', '), source: decl.source })
  rules.push({ prop: 'transition-delay', value: delays.split('|').join(', '), source: decl.source })

  decl.replaceWith(...rules)
}
