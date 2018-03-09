const assert = require(`assert`);

/**
 * Sets the edge of an element (i.e. top, right, bottom and left). This function
 * makes setting edges similar to margins and paddings where you can apply
 * a list of up to 4 values to set all edges. If `_` is specified for a
 * specific edge, that edge will not be set. If `~` is specified for a specific
 * edge, it will take the value of the previous edge.
 *
 * @param {Declaration} decl - @see module:postcss.Declaration
 * @param {string} top - Value for the top edge.
 * @param {string} [right] - Value for the right edge.
 * @param {string} [bottom] - Value for the bottom edge.
 * @param {string} [left] - Value for the left edge.
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
module.exports = function(decl, top, right, bottom, left) {
  assert(top, `Param "top" is required but not specified`);

  let t = top === `_` ? undefined : top;
  let r = undefined;
  let b = undefined;
  let l = undefined;

  switch (right) {
  case undefined: r = t; break;
  case `_`: r = undefined; break;
  case `~`: r = t; break;
  default: r = right;
  }

  switch (bottom) {
  case undefined: b = t; break;
  case `_`: b = undefined; break;
  case `~`: b = r; break;
  default: b = bottom;
  }

  switch (left) {
  case undefined: l = r; break;
  case `_`: l = undefined; break;
  case `~`: l = b; break;
  default: l = left;
  }

  const rules = [];
  if (t) rules.push({ prop: `top`, value: t, source: decl.source });
  if (r) rules.push({ prop: `right`, value: r, source: decl.source });
  if (b) rules.push({ prop: `bottom`, value: b, source: decl.source });
  if (l) rules.push({ prop: `left`, value: l, source: decl.source });

  decl.replaceWith.apply(decl, rules);
};