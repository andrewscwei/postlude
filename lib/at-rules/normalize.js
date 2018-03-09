const fs = require(`fs`);
const path = require(`path`);
const postcss = require(`postcss`);

/**
 * Clearfix hack for floated elements.
 *
 * @param {AtRule} atRule - @see module:postcss.AtRule
 * @param {boolean} [enable=true] - Specifies whether the rule is enabled.
 */
module.exports = async function(atRule) {
  const file = path.join(__dirname, `../resources/normalize.css`);
  const contents = fs.readFileSync(file, { encoding: `utf8` });
  const processed = postcss.parse(contents, { from: file });
  atRule.replaceWith(processed);
};
