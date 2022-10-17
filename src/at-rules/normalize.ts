import fs from 'fs'
import path from 'path'
import postcss, { AtRule } from 'postcss'

/**
 * Transforms a custom at-rule into a series of CSS normalizing rules.
 *
 * @param atRule - The {@link AtRule} to transform.
 */
export default async function normalize(atRule: AtRule) {
  const file = path.join(__dirname, '../../res/normalize.css')
  const contents = fs.readFileSync(file, { encoding: 'utf8' })
  const processed = postcss.parse(contents, { from: file })

  atRule.replaceWith(processed)
}
