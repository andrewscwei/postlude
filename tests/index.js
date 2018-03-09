const cssnano = require(`cssnano`);
const fs = require(`fs`);
const path = require(`path`);
const postcss = require(`postcss`);
const postlude = require(`../`);
const sorting = require(`postcss-sorting`);
const { describe, it } = require(`mocha`);

const CUSTOM_PROPERTIES_SPECS_DIR = path.join(__dirname, `specs`, `properties`);
const AT_RULES_SPECS_DIR = path.join(__dirname, `specs`, `at-rules`);
const SORTING_CONFIG = {
  'properties-order': `alphabetical`,
  'unspecified-properties-position': `bottom`
};

async function compare(funcName, { type }) {
  const dir = type === `at-rule` ? AT_RULES_SPECS_DIR : CUSTOM_PROPERTIES_SPECS_DIR;
  const pcss = fs.readFileSync(path.join(dir, `${funcName}.pcss`), `utf8`);
  const css = fs.readFileSync(path.join(dir, `${funcName}.css`), `utf8`);
  const src = await postcss([sorting(SORTING_CONFIG), cssnano]).process(css, { from: undefined });
  const dist = await postcss([postlude, sorting(SORTING_CONFIG), cssnano]).process(pcss, { from : undefined });

  if (src.css !== dist.css) {
    const message = `Unexpected post-processed results\n       Expectation: ${src.css}\n           Reality: ${dist.css}`;
    throw new Error(message);
  }
}

describe(`postlude`, function() {
  // Test custom properties.
  if (fs.existsSync(CUSTOM_PROPERTIES_SPECS_DIR)) {
    const funcNames = fs.readdirSync(CUSTOM_PROPERTIES_SPECS_DIR).reduce((arr, val) => {
      if (!val.endsWith(`.pcss`)) return arr;
      arr.push(path.basename(val, `.pcss`));
      return arr;
    }, []);

    funcNames.forEach(funcName => {
      it(`Custom property: ${funcName}`, async function() {
        await compare(funcName, { type: `property` });
      });
    });
  }

  // Test at-rules.
  if (fs.existsSync(AT_RULES_SPECS_DIR)) {
    const rules = fs.readdirSync(AT_RULES_SPECS_DIR).reduce((arr, val) => {
      if (!val.endsWith(`.pcss`)) return arr;
      arr.push(path.basename(val, `.pcss`));
      return arr;
    }, []);

    rules.forEach(ruleName => {
      it(`At-rule: ${ruleName}`, async function() {
        await compare(ruleName, { type: `at-rule` });
      });
    });
  }
});

