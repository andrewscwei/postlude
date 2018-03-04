const postcss = require(`postcss`);

module.exports = function(decl, family, size, weight) {
  const rule = postcss.rule({ selector: `&` });
  if (family) rule.append({ prop: `font-family`, value: family });
  if (size) rule.append({ prop: `font-size`, value: size });
  if (weight) rule.append({ prop: `font-weight`, value: weight });
  decl.replaceWith(rule);
};