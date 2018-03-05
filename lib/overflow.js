/**
 * Sets the overflow of the target selector.
 *
 * @param {Declaration} decl - @see module:postcss.Declaration
 * @param {string} overflowX - Specifies the overflow-x property.
 * @param {string} [overflowY=overflowX] - Specifies the overflow-y property. If
 *                                         unspecified the `overflowX` param
 *                                         will be used.
 */
module.exports = function(decl, overflowX, overflowY) {
  const x = overflowX;
  const y = (overflowY === undefined) ? x : overflowY;
  const rules = [];

  if (x !== `_`) rules.push({ prop: `overflow-x`, value: x, source: decl.source });
  if (y !== `_`) rules.push({ prop: `overflow-y`, value: y, source: decl.source });

  decl.replaceWith.apply(decl, rules);
};