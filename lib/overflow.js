const postcss = require(`postcss`);

module.exports = function(decl, ...args) {
  const x = args.shift();
  const y = (typeof args[0] === `boolean`) || (args[0] === undefined) ? x : args.shift();

  const rule = postcss.rule({ selector: `&` });
  if (x !== `_`) rule.append({ prop: `overflow-x`, value: x });
  if (y !== `_`) rule.append({ prop: `overflow-y`, value: y });

  decl.replaceWith(rule);
};