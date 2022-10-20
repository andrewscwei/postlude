import { AtRule } from 'postcss'
import box from './box'

export default function(atRule: AtRule, ...args: string[]) {
  return box(atRule, 'row', ...args)
}
