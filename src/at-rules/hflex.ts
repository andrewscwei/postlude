import { AtRule } from 'postcss'
import flex from './flex'

/**
 * Shorthand for transforming the target selector into a {@link flex} with
 * direction set to `horizontal`.
 *
 * @param atRule - The {@link AtRule} to transform.
 * @param args - See {@link flex}, except any directional specifiers are
 *               ignored.
 */
export default function(atRule: AtRule, ...args: string[]) {
  flex(atRule, 'horizontal', ...args)
}
