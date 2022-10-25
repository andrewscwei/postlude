import { AtRule } from 'postcss'
import flex from './flex'

export default function(atRule: AtRule, ...args: string[]) {
  return flex(atRule, 'column', ...args)
}
