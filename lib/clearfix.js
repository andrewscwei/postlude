const postcss = require(`postcss`);

/**
 * Clearfix hack for floated elements.
 *
 * @param {Declaration} decl - @see module:postcss.Declaration
 */
module.exports = function(decl) {
  const rule = postcss.rule({ selector: `&` });
  rule.append({ prop: `*zoom`, value: `1` });

  const beforeRule = postcss.rule({ selector: `&::before` });
  beforeRule.append({ prop: `content`, value: `` });
  beforeRule.append({ prop: `display`, value: `table` });

  const afterRule = postcss.rule({ selector: `&::after` });
  afterRule.append({ prop: `content`, value: `` });
  afterRule.append({ prop: `display`, value: `table` });
  afterRule.append({ prop: `clear`, value: `both` });

  rule.append(beforeRule);
  rule.append(afterRule);

  decl.replaceWith(rule);
};
