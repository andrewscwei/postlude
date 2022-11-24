import { AtRule } from 'postcss'
import stack from './stack'

/**
 * Shorthand for transforming the target selector into a {@link stack} with
 * direction set to `vertical`.
 *
 * @param atRule - The {@link AtRule} to transform.
 * @param args - See {@link stack}, except any directional specifiers are
 *               ignored.
 */
export default function(atRule: AtRule, ...args: string[]) {
  stack(atRule, 'vertical', ...args)
}
