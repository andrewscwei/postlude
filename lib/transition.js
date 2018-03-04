const postcss = require(`postcss`);

module.exports = function(decl, properties = `all`, durations = `0s`, timingFunctions = `ease`, delays = `0s`) {
  const rule = postcss.rule({ selector: `&` });

  rule.append({ prop: `transition-property`, value: properties.split(`/`).join(`,`) });
  rule.append({ prop: `transition-duration`, value: durations.split(`/`).join(`,`) });
  rule.append({ prop: `transition-timing-function`, value: timingFunctions.split(`/`).join(`,`) });
  rule.append({ prop: `transition-delay`, value: delays.split(`/`).join(`,`) });

  decl.replaceWith(rule);
};