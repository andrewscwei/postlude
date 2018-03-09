const _ = require(`lodash`);
const debug = require(`debug`)(`postlude`);
const fs = require(`fs`);
const isNull = require(`./utils/isNull`);
const path = require(`path`);
const postcss = require(`postcss`);
const valueParser = require(`postcss-value-parser`);
const { name: packageName, version } = require(`./package.json`);

debug(`v${version}`);

const DEFAULT_AT_RULE_NAME = `post`;
const DEFAULT_CUSTOM_PROPERTY_PREFIX = `-post-`;

module.exports = postcss.plugin(packageName, function({
  atRuleName = DEFAULT_AT_RULE_NAME,
  customPropertyPrefix = DEFAULT_CUSTOM_PROPERTY_PREFIX
} = {}) {
  return function(root) {
    // Walk at-rules first.
    root.walkAtRules(atRuleName, async function(atRule) {
      const t = valueParser(atRule.params);
      const rule = _.get(t, `nodes[0]`);

      if ((rule.type !== `function`) && (rule.type !== `word`)) return;

      const funcName = rule.value;
      const funcPath = path.join(__dirname, `lib/at-rules/${funcName}.js`);

      if (!fs.existsSync(funcPath)) {
        debug(`No function found with name "${funcName}"`);
        return;
      }

      const args = rule.nodes ? rule.nodes.reduce((arr, node) => {
        switch (node.type) {
        case `word`:
        case `string`:
          arr.push(isNull(node.value) ? undefined : node.value);
          break;
        case `function`:
          arr.push(valueParser.stringify(node));
          break;
        }
        return arr;
      }, []) : [];

      debug(`Applying ${funcName}(${args.join(`, `)})`);

      const func = require(funcPath);
      await func.apply(undefined, [atRule].concat(args));
    });

    // Then walk custom properties.
    root.walkRules(async function(rule) {
      const nodes = rule.nodes.filter(node => {
        return (node.type === `decl` && node.prop.startsWith(customPropertyPrefix));
      });

      const n = nodes.length;

      for (let i = 0; i < n; i++) {
        const node = nodes[i];
        const funcName = node.prop.substring(customPropertyPrefix.length);
        const funcPath = path.join(__dirname, `lib/properties/${funcName}.js`);

        if (!fs.existsSync(funcPath)) {
          debug(`No function found with name "${funcName}"`);
          return;
        }

        if (~node.value.indexOf(`,`)) {
          debug(`[warn]`, `You should not use comma as a delimiter, use space instead`);
        }

        const t = valueParser(node.value);
        const args = t.nodes ? t.nodes.reduce((arr, node) => {
          switch (node.type) {
          case `word`:
          case `string`:
            arr.push(isNull(node.value) ? undefined : node.value);
            break;
          case `function`:
            arr.push(valueParser.stringify(node));
            break;
          }
          return arr;
        }, []) : [];

        debug(`Applying ${funcName}(${args.join(`, `)})`);

        const func = require(funcPath);
        await func.apply(undefined, [node].concat(args));
      }
    });
  };
});