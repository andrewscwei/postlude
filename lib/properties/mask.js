/**
 * Applies mask to target selector.
 *
 * @param {Declaration} decl - @see module:postcss.Declaration
 */
module.exports = function(decl) {
  const rules = [];
  rules.push({ prop: `overflow`, value: `hidden`, source: decl.source });
  rules.push({ prop: `-webkit-mask-image`, value: `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC)`, source: decl.source });
  decl.replaceWith.apply(decl, rules);
};