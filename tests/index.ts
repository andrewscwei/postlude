/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */

import cssnano from 'cssnano'
import fs from 'fs'
import path from 'path'
import postcss from 'postcss'
import { main as packageMain } from '../package.json'

const { default: postludePlugin } = require(path.join(__dirname, '../', process.env.LIB_PATH || packageMain))
const sortingPlugin = require('postcss-sorting')

const SORTING_CONFIG = {
  'properties-order': 'alphabetical',
  'unspecified-properties-position': 'bottom',
}

async function compare(funcName: string, type: 'at-rule' | 'declaration') {
  const dir = path.join(__dirname, type === 'at-rule' ? 'at-rules' : 'declarations')
  const pcssRaw = fs.readFileSync(path.join(dir, `${funcName}.pcss`), 'utf8')
  const cssRaw = fs.readFileSync(path.join(dir, '__snapshots__', `${funcName}.css`), 'utf8')
  const pcssProcessed = await postcss([postludePlugin, sortingPlugin(SORTING_CONFIG), cssnano]).process(pcssRaw, { from: undefined })
  const cssProcessed = await postcss([sortingPlugin(SORTING_CONFIG), cssnano]).process(cssRaw, { from: undefined })

  if (pcssProcessed.css !== cssProcessed.css) {
    const message = `Unexpected post-processed results\n\tExpectation:\t${cssProcessed.css}\n\tReality:\t${pcssProcessed.css}`
    throw new Error(message)
  }
}

describe('postlude', () => {
  describe('at-rules', () => {
    const rules = fs.readdirSync(path.join(__dirname, 'at-rules'))
      .filter(t => path.extname(t) === '.pcss')
      .map(t => path.basename(t, '.pcss'))

    rules.forEach(ruleName => {
      it(`${ruleName}`, async () => {
        await compare(ruleName, 'at-rule')
      })
    })
  })

  describe('declarations', () => {
    const funcNames = fs.readdirSync(path.join(__dirname, 'declarations'))
      .filter(t => path.extname(t) === '.pcss')
      .map(t => path.basename(t, '.pcss'))

    funcNames.forEach(funcName => {
      it(`${funcName}`, async function() {
        await compare(funcName, 'declaration')
      })
    })
  })
})
