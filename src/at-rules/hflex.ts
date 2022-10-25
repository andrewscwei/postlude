import { AtRule } from 'postcss'
import box from './flex'

export default function(atRule: AtRule, ...args: string[]) {
  return box(atRule, 'row', ...args)
}
