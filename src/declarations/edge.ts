import assert from 'assert'
import { AtRule, Declaration } from 'postcss'

/**
 * Sets the edge of an element (i.e. top, right, bottom and left). This function
 * makes setting edges similar to margins and paddings where you can apply a
 * list of up to 4 values to define all edges. If `_` is specified for a
 * specific edge, that edge will not be set. If `~` is specified for a specific
 * edge, it will take the value of the previous edge.
 *
 * @param node - The {@link AtRule} or {@link Declaration} to transform.
 * @param top - Value for the top edge.
 * @param right - Value for the right edge.
 * @param bottom - Value for the bottom edge.
 * @param left - Value for the left edge.
 *
 * @example
 *   -post-edge: 0px;
 *
 *   // top: 0px;
 *   // right: 0px;
 *   // bottom: 0px;
 *   // left: 0px;
 *
 * @example
 *   -post-edge: 0px 5px;
 *
 *   // top: 0px;
 *   // right: 5px;
 *   // bottom: 0px;
 *   // left: 5px;
 *
 * @example
 *   -post-edge: edge: 0px 5px ~ _;
 *
 *   // top: 0px;
 *   // right: 5px;
 *   // bottom: 5px;
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
  if (t) decls.push({ prop: 'top', value: t, source: node.source })
  if (r) decls.push({ prop: 'right', value: r, source: node.source })
  if (b) decls.push({ prop: 'bottom', value: b, source: node.source })
  if (l) decls.push({ prop: 'left', value: l, source: node.source })

  node.replaceWith(...decls)
}
