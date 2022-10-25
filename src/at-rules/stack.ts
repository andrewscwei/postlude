import { AtRule, Rule } from 'postcss'
import parseArg from '../utils/parseArg'
import flex from './flex'

/**
 *
 * @requires postcss-nesting
 */
export default function(atRule: AtRule, ...args: string[]) {
  const parent = atRule.parent
  const source = atRule.source

  flex(atRule, ...args)

  const direction = parseArg(args, ['row', 'column', 'row-reverse', 'column-reverse'], 'row')
  const childRule = new Rule({ selector: '& > *:not(:last-child)' })
  const value = '1rem'

  switch (direction) {
    case 'column':
      childRule.append({ prop: 'margin-top', value: 'unset', source })
      childRule.append({ prop: 'margin-right', value: 'unset', source })
      childRule.append({ prop: 'margin-bottom', value, source })
      childRule.append({ prop: 'margin-left', value: 'unset', source })
      break
    case 'column-reverse':
      childRule.append({ prop: 'margin-top', value, source })
      childRule.append({ prop: 'margin-right', value: 'unset', source })
      childRule.append({ prop: 'margin-bottom', value: 'unset', source })
      childRule.append({ prop: 'margin-left', value: 'unset', source })
      break
    case 'row-reverse':
      childRule.append({ prop: 'margin-top', value: 'unset', source })
      childRule.append({ prop: 'margin-right', value: 'unset', source })
      childRule.append({ prop: 'margin-bottom', value: 'unset', source })
      childRule.append({ prop: 'margin-left', value, source })
      break
    case 'row':
    default:
      childRule.append({ prop: 'margin-top', value: 'unset', source })
      childRule.append({ prop: 'margin-right', value, source })
      childRule.append({ prop: 'margin-bottom', value: 'unset', source })
      childRule.append({ prop: 'margin-left', value: 'unset', source })
  }

  parent?.append(childRule)
}
