/**
 * Makes a video fill the parent block.
 *
 * @param {Declaration} decl - @see module:postcss.Declaration
 */
module.exports = function(decl) {
  const rules = [];
  rules.push({ prop: `left`, value: `50%`, source: decl.source });
  rules.push({ prop: `top`, value: `50%`, source: decl.source });
  rules.push({ prop: `position`, value: `absolute`, source: decl.source });
  rules.push({ prop: `min-width`, value: `100%`, source: decl.source });
  rules.push({ prop: `min-height`, value: `100%`, source: decl.source });
  rules.push({ prop: `transform`, value: `translate3d(-50%, -50%, 0)`, source: decl.source });
  decl.replaceWith.apply(decl, rules);
};