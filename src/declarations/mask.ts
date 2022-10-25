import { AtRule, Declaration } from 'postcss'

/**
 * Applies mask to target selector.
 *
 * @param node - The {@link AtRule} or {@link Declaration} to transform.
 */
export default function(node: AtRule | Declaration) {
  const decls = []
  decls.push({ prop: 'overflow', value: 'hidden', source: node.source })
  decls.push({ prop: 'mask-image', value: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC)', source: node.source })

  node.replaceWith(...decls)
}
