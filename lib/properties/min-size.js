const assert = require(`assert`);

/**
 * Sets the min size of the target selector.
 *
 * @param {Declaration} decl - @see module:postcss.Declaration
 * @param {...string} args - First argument indicates the width. Second argument
 *                           indicates the height. If unspecified, the width
 *                           will be used as the height. The third and last
 *                           argument indicates whether the selector is an oval
 *                           by applying border-radius that is half of its
 *                           smallest edge.
 */
module.exports = function(decl, ...args) {
  assert(args.length >= 1 && args.length <= 2, `This method must accept 1..2 arguments`);

  const width = args.shift();
  const height = (args[0] === undefined) ? width : args.shift();

  const rules = [];

  if (width !== `_`) rules.push({ prop: `min-width`, value: width, source: decl.source });
  if (height !== `_`) rules.push({ prop: `min-height`, value: height, source: decl.source });

  decl.replaceWith.apply(decl, rules);
};