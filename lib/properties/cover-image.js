/**
 * Makes an image fill the parent block. Note that this mixin doesn't support
 * all browsers.
 *
 * @param {Declaration} decl - @see module:postcss.Declaration
 *
 * @link http://caniuse.com/#feat=object-fit
 */
module.exports = function(decl) {
  const rules = [];
  rules.push({ prop: `width`, value: `100%`, source: decl.source });
  rules.push({ prop: `height`, value: `100%`, source: decl.source });
  rules.push({ prop: `object-fit`, value: `cover`, source: decl.source });
  decl.replaceWith.apply(decl, rules);
};