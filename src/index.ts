/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-require-imports */

import useDebug from 'debug'
import path from 'path'
import { AtRule, Declaration, Plugin } from 'postcss'
import valueParser from 'postcss-value-parser'
import { name as packageName, version as packageVersion } from '../package.json'
import isNull from './utils/isNull'

type Options = {
  atRuleName?: string
  customPropertyPrefix?: string
}

const DEFAULT_AT_RULE_NAME = 'post'
const DEFAULT_CUSTOM_PROPERTY_PREFIX = '-post-'

const debug = useDebug('postlude')

debug(`v${packageVersion}`)

export const postcss = true

export default ({
  atRuleName = DEFAULT_AT_RULE_NAME,
  customPropertyPrefix = DEFAULT_CUSTOM_PROPERTY_PREFIX,
}: Options = {}): Plugin => ({
  postcssPlugin: packageName,
  Once(root) {
    // Walk at-rules first.
    root.walkAtRules(atRuleName, atRule => {
      const value = valueParser(atRule.params)
      const rule = value.nodes[0]

      if (rule.type !== 'function' && rule.type !== 'word') return

      const funcName = rule.value
      const funcPath = path.join(__dirname, `./at-rules/${funcName}`)
      let func: (atRule: AtRule, ...args: any[]) => void

      try {
        func = require(funcPath)
      }
      catch (err) {
        return debug('Searching for at-rule processor function...', 'ERR', `No function found with name <${funcName}>`)
      }

      const args = rule.type === 'function' ? rule.nodes.reduce<(string | undefined)[]>((arr, node) => {
        switch (node.type) {
          case 'word':
          case 'string':
            arr.push(isNull(node.value) ? undefined : node.value)
            break
          case 'function':
            arr.push(valueParser.stringify(node))
            break
          default:
            break
        }

        return arr
      }, []) : []

      debug(`Applying ${funcName}(${args.join(', ')})...`, 'OK')

      func(atRule, ...args)
    })

    // Then walk custom properties.
    root.walkRules(rule => {
      const declarations = rule.nodes.filter(node => node.type === 'decl' && node.prop.startsWith(customPropertyPrefix)) as Declaration[]
      const n = declarations.length

      for (let i = 0; i < n; i++) {
        const declaration = declarations[i]
        const funcName = declaration.prop.substring(customPropertyPrefix.length)
        const funcPath = path.join(__dirname, `./properties/${funcName}`)
        let func: (decl: Declaration, ...args: any[]) => void

        try {
          func = require(funcPath)
        }
        catch (err) {
          return debug('Searching for declaration processor function...', 'ERR', `No function found with name <${funcName}>`)
        }

        if (declaration.value.indexOf(',') > -1) {
          debug('Processing declaration value...', 'WARN', 'You should not use comma as a delimiter, use space instead')
        }

        const value = valueParser(declaration.value)
        const args = value.nodes ? value.nodes.reduce<(string | undefined)[]>((arr, node) => {
          switch (node.type) {
            case 'word':
            case 'string':
              arr.push(isNull(node.value) ? undefined : node.value)
              break
            case 'function':
              arr.push(valueParser.stringify(node))
              break
            default:
              break
          }

          return arr
        }, []) : []

        debug(`Applying ${funcName}(${args.join(', ')})...`, 'OK')

        func(declaration, ...args)
      }
    })
  },
})
