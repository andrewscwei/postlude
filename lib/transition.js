/**
 * Applies multiple transition rules at once.
 *
 * @param {Declaration} decl - @see module:postcss.Declaration
 * @param {string} [properties=`all`] - Transition property(ies) delimited by
 *                                      `|`.
 * @param {string} [durations=`0s`] - Transition duration(s) delimited by `|`.
 * @param {string} [timingFunctions=`ease`] - Transition timing function(s)
 *                                            delimited by `|`.
 * @param {string} [delays=`0s`] - Transition delay(s) delimited by `|`.
 */
module.exports = function(decl, properties = `all`, durations = `0s`, timingFunctions = `ease`, delays = `0s`) {
  const rules = [];
  rules.push({ prop: `transition-property`, value: properties.split(`|`).join(`, `), source: decl.source });
  rules.push({ prop: `transition-duration`, value: durations.split(`|`).join(`, `), source: decl.source });
  rules.push({ prop: `transition-timing-function`, value: timingFunctions.split(`|`).join(`, `), source: decl.source });
  rules.push({ prop: `transition-delay`, value: delays.split(`|`).join(`, `), source: decl.source });
  decl.replaceWith.apply(decl, rules);
};