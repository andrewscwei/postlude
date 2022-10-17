/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */

import useDebug from 'debug'
import path from 'path'
import { AtRule, Declaration, Plugin } from 'postcss'
import valueParser from 'postcss-value-parser'
import isNull from './utils/isNull'

type Options = {
  atRuleName?: string
  customPropertyPrefix?: string
}

const DEFAULT_AT_RULE_NAME = 'post'
const DEFAULT_CUSTOM_PROPERTY_PREFIX = '-post-'

const debug = useDebug('postlude')

const postlude = ({
  atRuleName = DEFAULT_AT_RULE_NAME,
  customPropertyPrefix = DEFAULT_CUSTOM_PROPERTY_PREFIX,
}: Options = {}): Plugin => ({
  'postcssPlugin': 'postlude',
  'AtRule': {
    [atRuleName]: atRule => {
      const value = valueParser(atRule.params)
      const rule = value.nodes[0]

      if (rule.type !== 'function' && rule.type !== 'word') return

      const funcName = rule.value
      const funcPath = path.join(__dirname, `./at-rules/${funcName}`)
      let func: (atRule: AtRule, ...args: any[]) => void

      try {
        func = require(funcPath).default
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
  'Declaration': {
    '*': decl => {
      if (!decl.prop.startsWith(customPropertyPrefix)) return

      const funcName = decl.prop.substring(customPropertyPrefix.length)
      const funcPath = path.join(__dirname, `./properties/${funcName}`)
      let func: (decl: Declaration, ...args: any[]) => void

      try {
        func = require(funcPath).default
      }
      catch (err) {
        return debug('Searching for declaration processor function...', 'ERR', `No function found with name <${funcName}>`)
      }

      if (decl.value.indexOf(',') > -1) {
        debug('Processing declaration value...', 'WARN', 'You should not use comma as a delimiter, use space instead')
      }

      const value = valueParser(decl.value)
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
