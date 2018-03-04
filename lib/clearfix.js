const assert = require(`assert`);
const postcss = require(`postcss`);

/**
 * Clearfix hack for floated elements.
 *
 * @param {Declaration} decl - @see module:postcss.Declaration
 * @param {boolean} [enable=true] - Specifies whether the rule is enabled.
 */
module.exports = function(decl, enable = true) {
  if (!enable) return;

  assert(decl.parent.selector, `No selector found`);
  assert(decl.parent.parent, `No parent container found`);

  const beforeRule = postcss.rule({ selector: `${decl.parent.selector}::before` });
  beforeRule.append({ prop: `content`, value: `''`, source: decl.source });
  beforeRule.append({ prop: `display`, value: `table`, source: decl.source });

  const afterRule = postcss.rule({ selector: `${decl.parent.selector}::after` });
  afterRule.append({ prop: `content`, value: `''`, source: decl.source });
  afterRule.append({ prop: `display`, value: `table`, source: decl.source });
  afterRule.append({ prop: `clear`, value: `both`, source: decl.source });

  decl.parent.parent.insertAfter(decl.parent, afterRule);
  decl.parent.parent.insertAfter(decl.parent, beforeRule);

  decl.replaceWith({ prop: `*zoom`, value: `1`, source: decl.source });
};
