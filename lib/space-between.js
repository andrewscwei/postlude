const postcss = require(`postcss`);

module.exports = function(decl, value, direction=`>`) {
  const rule = postcss.rule({ selector: `&:not(:last-child)`});

  switch (direction) {
  case `v`:
  case `vertical`:
  case `column`:
    rule.append({ prop: `margin-bottom`, value: value });
    break;
  case `>`:
  case `horizontal`:
  case `row`:
  default:
    rule.append({ prop: `margin-right`, value: value });
  }
  decl.replaceWith(rule);
};