import { AtRule } from 'postcss'
import stack from './stack'

export default function(atRule: AtRule, ...args: string[]) {
  return stack(atRule, 'column', ...args)
}
