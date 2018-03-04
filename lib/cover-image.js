const postcss = require(`postcss`);

module.exports = function(decl) {
  const rule = postcss.rule({ selector: `&` });
  rule.append({ prop: `width`, value: `100%` });
  rule.append({ prop: `height`, value: `100%` });
  rule.append({ prop: `object-fit`, value: `cover` });
  decl.replaceWith(rule);
};