const assert = require(`assert`);

/**
 * Sets the margin of the target selector. Similar to the original 'margin' CSS
 * rule, except for the addition of 2 values: `_` and `~`. If `_` is used, that
 * side will not be set. If `~` is used, that side will take the value of the
 * previous side.
 *
 * @param {Declaration} decl - @see module:postcss.Declaration
 * @param {string} top - Value for the top margin.
 * @param {string} [right] - Value for the right margin.
 * @param {string} [bottom] - Value for the bottom margin.
 * @param {string} [left] - Value for the left margin.
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

  const res = [];
  if (t) res.push({ prop: `margin-top`, value: t, source: decl.source });
  if (r) res.push({ prop: `margin-right`, value: r, source: decl.source });
  if (b) res.push({ prop: `margin-bottom`, value: b, source: decl.source });
  if (l) res.push({ prop: `margin-left`, value: l, source: decl.source });

  decl.replaceWith.apply(decl, res);
};