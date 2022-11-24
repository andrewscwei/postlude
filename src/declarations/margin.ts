import assert from 'assert'
import { AtRule, Declaration } from 'postcss'

/**
 * Sets the margin of the target selector. Similar to the original 'margin' CSS
 * rule, except for the addition of 2 values: `_` and `~`. If `_` is used, that
 * side will not be set. If `~` is used, that side will take the value of the
 * previous side.
 *
 * @param node - The {@link AtRule} or {@link Declaration} to transform.
 * @param top - Value for the top margin.
 * @param right - Value for the right margin.
 * @param bottom - Value for the bottom margin.
 * @param left - Value for the left margin.
 *
 * @example
 *   -post-margin: 0px;
 *
 *   // margin-top: 0px;
 *   // margin-right: 0px;
 *   // margin-bottom: 0px;
 *   // margin-left: 0px;
 *
 * @example
 *   -post-margin: 0px 5px;
 *
 *   // margin-top: 0px;
 *   // margin-right: 5px;
 *   // margin-bottom: 0px;
 *   // margin-left: 5px;
 *
 * @example
 *   -post-margin: 0px 5px ~ _;
 *
 *   // margin-top: 0px;
 *   // margin-right: 5px;
 *   // margin-bottom: 5px;
 */
export default function(node: AtRule | Declaration, top: string, right?: string, bottom?: string, left?: string) {
  assert(top, 'Param "top" is required but not specified')

  const t = top === '_' ? undefined : top
  let r
  let b
  let l

  switch (right) {
    case undefined: r = t; break
    case '_': r = undefined; break
    case '~': r = t; break
    default: r = right
  }

  switch (bottom) {
    case undefined: b = t; break
    case '_': b = undefined; break
    case '~': b = r; break
    default: b = bottom
  }

  switch (left) {
    case undefined: l = r; break
    case '_': l = undefined; break
    case '~': l = b; break
    default: l = left
  }

  const decls = []
  if (t) decls.push({ prop: 'margin-top', value: t, source: node.source })
  if (r) decls.push({ prop: 'margin-right', value: r, source: node.source })
  if (b) decls.push({ prop: 'margin-bottom', value: b, source: node.source })
  if (l) decls.push({ prop: 'margin-left', value: l, source: node.source })

  node.replaceWith(...decls)
}
