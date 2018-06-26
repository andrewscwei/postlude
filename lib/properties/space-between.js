const assert = require(`assert`);
const postcss = require(`postcss`);
const getDirection = require(`../../utils/getDirection`);

/**
 * Sets the space in between adjacent elements excluding the first and last
 * element.
 *
 * @param {number} $value           - Specifies the value of the gap.
 * @param {string} $direction ['>'] - Specifies the direction. '>', 'horizontal'
 *                                    and 'row' means horizontal. 'v', 'vertical'
 *                                    and 'column' means vertical.
 * @param {boolean} $unset [false]  - Unsets other margins set by this mixin.
 */
module.exports = function(decl, value, direction=`>`) {
  assert(decl.parent.selector, `No selector found`);
  assert(decl.parent.parent, `No parent container found`);

  const rule = postcss.rule({ selector: `${decl.parent.selector}:not(:last-child)` });

  switch (getDirection(direction)) {
  case `v`:
    rule.append({ prop: `margin-bottom`, value: value, source: decl.source });
    break;
  case `>`:
    rule.append({ prop: `margin-right`, value: value, source: decl.source });
    break;
  default:
    // Do nothing.
  }

  decl.parent.parent.insertAfter(decl.parent, rule);
  decl.remove();
};