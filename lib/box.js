const debug = require(`debug`)(`postlude:box`);
const postcss = require(`postcss`);

module.exports = function(decl, ...args) {
  const alignH = (args.includes(`left`) && `left`) || (args.includes(`right`) && `right`) || `center`;
  const alignV = (args.includes(`top`) && `top`) || (args.includes(`bottom`) && `bottom`) || `center`;
  const type = args[0] && ((args[0].startsWith(`filled`) && `filled`) || (args[0].startsWith(`constrained`) && `constrained`)) || `default`;
  const direction = args[0] && ((args[0].endsWith(`^`) && `^`) || (args[0].endsWith(`v`) && `v`) || (args[0].endsWith(`<`) && `<`)) || `>`;

  debug(`${type}, ${direction}, ${alignH}, ${alignV}`);

  const rule = postcss.rule({ selector: `&` });
  rule.append({ prop: `display`, value: `flex` });
  rule.append({ prop: `flex-wrap`, value: `nowrap` });
  rule.append({ prop: `line-height`, value: `normal` });
  rule.append({ prop: `white-space`, value: `normal` });

  switch (direction) {
  case `^`:
    rule.append({ prop: `flex-direction`, value: `column-reverse` });
    rule.append({ prop: `justify-content`, value: (alignV === `bottom` && `flex-start`) || (alignV === `top` && `flex-end`) || `center` });

    if (type === `default`) {
      rule.append({ prop: `align-items`, value: (alignH === `left` && `flex-start`) || (alignH === `right` && `flex-end`) || `center` });
    }
    else {
      rule.append({ prop: `align-items`, value: `stretch` });
    }
    break;
  case `v`:
    rule.append({ prop: `flex-direction`, value: `column` });
    rule.append({ prop: `justify-content`, value: (alignV === `top` && `flex-start`) || (alignV === `bottom` && `flex-end`) || `center` });

    if (type === `default`) {
      rule.append({ prop: `align-items`, value: (alignH === `left` && `flex-start`) || (alignH === `right` && `flex-end`) || `center` });
    }
    else {
      rule.append({ prop: `align-items`, value: `stretch` });
    }
    break;
  case `<`:
    rule.append({ prop: `flex-direction`, value: `row-reverse` });
    rule.append({ prop: `justify-content`, value: (alignH === `right` && `flex-start`) || (alignH === `left` && `flex-end`) || `center` });

    if (type === `default`) {
      rule.append({ prop: `align-items`, value: (alignV === `top` && `flex-start`) || (alignV === `bottom` && `flex-end`) || `center` });
    }
    else {
      rule.append({ prop: `align-items`, value: `stretch` });
    }
    break;
  default:
    rule.append({ prop: `flex-direction`, value: `row` });
    rule.append({ prop: `justify-content`, value: (alignH === `left` && `flex-start`) || (alignH === `right` && `flex-end`) || `center` });

    if (type === `default`) {
      rule.append({ prop: `align-items`, value: (alignV === `top` && `flex-start`) || (alignV === `bottom` && `flex-end`) || `center` });
    }
    else {
      rule.append({ prop: `align-items`, value: `stretch` });
    }
  }

  const subRule = postcss.rule({ selector: `& > *` });

  switch (type) {
  case `filled`:
    subRule.append({ prop: `flex-grow`, value: 1 });
    subRule.append({ prop: `flex-basis`, value: 0 });
    subRule.append({ prop: `flex-shrink`, value: 0 });
    break;
  case `constrained`:
    subRule.append({ prop: `flex-grow`, value: 0 });
    subRule.append({ prop: `flex-basis`, value: `auto` });
    subRule.append({ prop: `flex-shrink`, value: 1 });
    break;
  default:
    subRule.append({ prop: `flex-grow`, value: 0 });
    subRule.append({ prop: `flex-basis`, value: `auto` });
    subRule.append({ prop: `flex-shrink`, value: 0 });
  }

  rule.append(subRule);

  decl.replaceWith(rule);
};