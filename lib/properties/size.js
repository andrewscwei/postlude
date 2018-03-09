const assert = require(`assert`);
const isBool = require(`../../utils/isBool`);
const valueParser = require(`postcss-value-parser`);

/**
 * Sets the size of the target selector.
 *
 * @param {Declaration} decl - @see module:postcss.Declaration
 * @param {...string} args - First argument indicates the width. Second argument
 *                           indicates the height. If unspecified, the width
 *                           will be used as the height. The third and last
 *                           argument indicates whether the selector is an oval
 *                           by applying border-radius that is half of its
 *                           smallest edge.
 */
module.exports = function(decl, ...args) {
  assert(args.length >= 1 && args.length <= 3, `This method must accept 1..3 arguments`);
  assert(!isBool(args[0]), `First argument must be the width`);

  const width = args.shift();
  const height = (isBool(args[0]) || (args[0] === undefined)) ? width : args.shift();
  const isOval = isBool(args[0]) ? args[0] : false;

  const rules = [];

  if (width !== `_`) rules.push({ prop: `width`, value: width, source: decl.source });
  if (height !== `_`) rules.push({ prop: `height`, value: height, source: decl.source });
  if (isOval) {
    const w = valueParser.unit(width);
    const h = valueParser.unit(height);
    let t = undefined;

    if (w === false && h !== false) {
      t = h;
    }
    else if (w !== false && h === false) {
      t = h;
    }
    else if (w === false && h === false) {
      t = undefined;
    }
    else if (Number(w.number) >= Number(h.number)) {
      t = h;
    }
    else if (Number(w.number) < Number(h.number)) {
      t = w;
    }

    if (t) {
      rules.push({ prop: `border-radius`, value: `${Number(t.number)/2}${t.unit}`, source: decl.source });
      rules.push({ prop: `overflow`, value: `hidden`, source: decl.source });
    }
  }

  decl.replaceWith.apply(decl, rules);
};