const postcss = require(`postcss`);

module.exports = function(decl, ...args) {
  const rule = postcss.rule({ selector: `&` });
  const alignH = (args.includes(`left`) && `left`) || (args.includes(`right`) && `right`) || `center`;
  const alignV = (args.includes(`top`) && `top`) || (args.includes(`bottom`) && `bottom`) || `center`;
  const position = (args.includes(`fixed`) && `fixed`) || `absolute`;

  switch (alignH) {
  case `left`:
    rule.append({ prop: `left`, value: 0 });
    break;
  case `right`:
    rule.append({ prop: `right`, value: 0 });
    break;
  default:
    rule.append({ prop: `left`, value: 0 });
    rule.append({ prop: `right`, value: 0 });
  }

  switch (alignV) {
  case `top`:
    rule.append({ prop: `top`, value: 0 });
    break;
  case `bottom`:
    rule.append({ prop: `bottom`, value: 0 });
    break;
  default:
    rule.append({ prop: `top`, value: 0 });
    rule.append({ prop: `bottom`, value: 0 });
  }

  rule.append({ prop: `position`, value: position });

  decl.replaceWith(rule);
};