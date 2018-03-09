/**
 * Sets the font properties for the target selector.
 *
 * @param {Declaration} decl - @see module:postcss.Declaration
 * @param {string} family - The font-family property.
 * @param {string} [size] - Th font-size property.
 * @param {string} [weight] - The font-weight property.
 */
module.exports = function(decl, family, size, weight) {
  const rules = [];
  if (family) rules.push({ prop: `font-family`, value: family, source: decl.source });
  if (size) rules.push({ prop: `font-size`, value: size, source: decl.source });
  if (weight) rules.push({ prop: `font-weight`, value: weight, source: decl.source });
  decl.replaceWith.apply(decl, rules);
};