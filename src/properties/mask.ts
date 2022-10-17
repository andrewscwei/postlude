import { Declaration } from 'postcss'

/**
 * Applies mask to target selector.
 *
 * @param decl - The {@link Declaration} to transform.
 */
export default function(decl: Declaration) {
  const rules = []
  rules.push({ prop: 'overflow', value: 'hidden', source: decl.source })
  rules.push({ prop: '-webkit-mask-image', value: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC)', source: decl.source })

  decl.replaceWith(...rules)
}
