const postcss = require(`postcss`);

module.exports = function(decl) {
  const rule = postcss.rule({ selector: `&` });
  rule.append({ prop: `left`, value: `50%` });
  rule.append({ prop: `top`, value: `50%` });
  rule.append({ prop: `position`, value: `absolute` });
  rule.append({ prop: `min-width`, value: `100%` });
  rule.append({ prop: `min-height`, value: `100%` });
  rule.append({ prop: `transform`, value: `translate3d(-50%, -50%, 0)` });
  decl.replaceWith(rule);
};