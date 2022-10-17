/** @license postlude
 * © Andrew Wei
 * This source code is licensed under the MIT license found in the LICENSE file in the root
 * directory of this source tree.
 */

/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */

import path from 'path'
import { AtRule, Declaration, Plugin } from 'postcss'
import valueParser from 'postcss-value-parser'
import isNull from './utils/isNull'
import debug from './utils/useDebug'

type Options = {
  atRuleName?: string
  declarationPrefix?: string
}

const DEFAULT_AT_RULE_NAME = 'post'
const DEFAULT_DECLARATION_PREFIX = '-post-'

const postlude = ({
  atRuleName = DEFAULT_AT_RULE_NAME,
  declarationPrefix = DEFAULT_DECLARATION_PREFIX,
}: Options = {}): Plugin => ({
  postcssPlugin: 'postlude',
  AtRule: {
    [atRuleName]: atRule => {
      const value = valueParser(atRule.params)
      const rule = value.nodes[0]

      if (rule.type !== 'function' && rule.type !== 'word') return

      const funcName = rule.value
      const func = getFunc(funcName, 'at-rule')
      const args = getArgs(rule)

      try {
        func(atRule, ...args)
        debug(`Applying ${funcName}(${args.join(', ')})...`, 'OK')
      }
      catch (err) {
        debug(`Applying ${funcName}(${args.join(', ')})...`, 'ERR')
        throw err
      }
    },
  },
  Declaration: {
    '*': decl => {
      if (!decl.prop.startsWith(declarationPrefix)) return

      const funcName = decl.prop.substring(declarationPrefix.length)
      const func = getFunc(funcName, 'declaration')
      const args = getArgs(valueParser(decl.value))

      try {
        func(decl, ...args)
        debug(`Applying ${funcName}(${args.join(', ')})...`, 'OK')
      }
      catch (err) {
        debug(`Applying ${funcName}(${args.join(', ')})...`, 'ERR')
        throw err
      }
    },
  },
})

postlude.postcss = true

export default postlude

/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
function getFunc(name: string, type: 'at-rule' | 'declaration'): (node: AtRule | Declaration, ...args: any[]) => void {
  const funcPath = path.join(__dirname, type === 'at-rule' ? 'at-rules' : 'declarations', name)
  const altFuncPath = path.join(__dirname, 'all', name)

  try {
    return require(funcPath).default
  }
  catch {
    try {
      return require(altFuncPath).default
    }
    catch {
      throw Error(`No custom ${type} found with name <${name}>`)
    }
  }
}

function getArgs(value: any): any[] {
  const nodes: any[] = value.nodes

  if (!nodes) return []

  return nodes.reduce<(string | undefined)[]>((args, node) => {
    switch (node.type) {
      case 'word':
      case 'string':
        args.push(isNull(node.value) ? undefined : node.value)
        break
      case 'function':
        args.push(valueParser.stringify(node))
        break
      default:
        break
    }

    return args
  }, [])
}
