const assert = require(`assert`);

/**
 * Sets the padding of the target selector. Similar to the original 'padding'
 * CSS rule, except for the addition of 2 values: `_` and `~`. If `_` is used,
 * that side will not be set. If `~` is used, that side will take the value of
 * the previous side.
 *
 * @param {Declaration} decl - @see module:postcss.Declaration
 * @param {string} top - Value for the top padding.
 * @param {string} [right] - Value for the right padding.
 * @param {string} [bottom] - Value for the bottom padding.
 * @param {string} [left] - Value for the left padding.
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
  if (t) res.push({ prop: `padding-top`, value: t, source: decl.source });
  if (r) res.push({ prop: `padding-right`, value: r, source: decl.source });
  if (b) res.push({ prop: `padding-bottom`, value: b, source: decl.source });
  if (l) res.push({ prop: `padding-left`, value: l, source: decl.source });

  decl.replaceWith.apply(decl, res);
};