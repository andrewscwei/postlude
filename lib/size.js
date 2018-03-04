const postcss = require(`postcss`);
const stou = require(`../utils/stou`);
const utos = require(`../utils/utos`);

module.exports = function(decl, ...args) {
  const width = args.shift();
  const height = (typeof args[0] === `boolean`) || (args[0] === undefined) ? width : args.shift();
  const isOval = typeof args[0] === `boolean` ? args[0] : false;

  const rule = postcss.rule({ selector: `&` });
  if (width !== `_`) rule.append({ prop: `width`, value: width });
  if (height !== `_`) rule.append({ prop: `height`, value: height });
  if (isOval) {
    const w = utos(width);
    const h = utos(height);
    const unit = w.value >= h.value ? h.unit : w.unit;
    rule.append({ prop: `border-radius`, value: stou({ value: Math.min(w.value, h.value), unit }) });
    rule.append({ prop: `overflow`, value: `hidden` });
  }

  decl.replaceWith(rule);
};