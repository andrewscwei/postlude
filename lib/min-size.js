const postcss = require(`postcss`);

module.exports = function(decl, ...args) {
  const width = args.shift();
  const height = (typeof args[0] === `boolean`) || (args[0] === undefined) ? width : args.shift();

  const rule = postcss.rule({ selector: `&` });
  if (width !== `_`) rule.append({ prop: `min-width`, value: width });
  if (height !== `_`) rule.append({ prop: `min-height`, value: height });

  decl.replaceWith(rule);
};