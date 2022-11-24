import assert from 'assert'
import { AtRule, Declaration } from 'postcss'

/**
 * Sets the padding of the target selector. Similar to the original 'padding'
 * CSS rule, except for the addition of 2 values: `_` and `~`. If `_` is used,
 * that side will not be set. If `~` is used, that side will take the value of
 * the previous side.
 *
 * @param node - The {@link AtRule} or {@link Declaration} to transform.
 * @param top - Value for the top padding.
 * @param right - Value for the right padding.
 * @param bottom - Value for the bottom padding.
 * @param left - Value for the left padding.
 *
 * @example
 *   -post-padding: 0px;
 *
 *   // padding-top: 0px;
 *   // padding-right: 0px;
 *   // padding-bottom: 0px;
 *   // padding-left: 0px;
 *
 * @example
 *   -post-padding: 0px 5px;
 *
 *   // padding-top: 0px;
 *   // padding-right: 5px;
 *   // padding-bottom: 0px;
 *   // padding-left: 5px;
 *
 * @example
 *   -post-padding: 0px 5px ~ _;
 *
 *   // padding-top: 0px;
 *   // padding-right: 5px;
 *   // padding-bottom: 5px;
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
  if (t) decls.push({ prop: 'padding-top', value: t, source: node.source })
  if (r) decls.push({ prop: 'padding-right', value: r, source: node.source })
  if (b) decls.push({ prop: 'padding-bottom', value: b, source: node.source })
  if (l) decls.push({ prop: 'padding-left', value: l, source: node.source })

  node.replaceWith(...decls)
}
