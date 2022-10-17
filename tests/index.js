const cssnano = require('cssnano')
const fs = require('fs')
const { describe, it } = require('mocha')
const path = require('path')
const postcss = require('postcss')
const sorting = require('postcss-sorting')
const { default: postlude } = require('../lib')

const SORTING_CONFIG = {
  'properties-order': 'alphabetical',
  'unspecified-properties-position': 'bottom',
}

async function compare(funcName, { type }) {
  const dir = type === 'at-rule' ? 'at-rules' : 'properties'
  const pcssRaw = fs.readFileSync(path.join(__dirname, dir, `${funcName}.pcss`), 'utf8')
  const cssRaw = fs.readFileSync(path.join(__dirname, dir, '__snapshots__', `${funcName}.css`), 'utf8')
  const pcssProcessed = await postcss([postlude, sorting(SORTING_CONFIG), cssnano]).process(pcssRaw, { from: undefined })
  const cssProcessed = await postcss([sorting(SORTING_CONFIG), cssnano]).process(cssRaw, { from: undefined })

  if (pcssProcessed.css !== cssProcessed.css) {
    const message = `Unexpected post-processed results\n       Expectation: ${cssProcessed.css}\n           Reality: ${pcssProcessed.css}`
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
        await compare(ruleName, { type: 'at-rule' })
      })
    })
  })

  describe('custom properties', () => {
    const funcNames = fs.readdirSync(path.join(__dirname, 'properties'))
      .filter(t => path.extname(t) === '.pcss')
      .map(t => path.basename(t, '.pcss'))

    funcNames.forEach(funcName => {
      it(`${funcName}`, async function() {
        await compare(funcName, { type: 'property' })
      })
    })
  })
})
