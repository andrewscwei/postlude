const cssnano = require(`cssnano`);
const fs = require(`fs`);
const path = require(`path`);
const postcss = require(`postcss`);
const postlude = require(`../`);
const { describe, it } = require(`mocha`);

const SPECS_DIR = path.join(__dirname, `specs`);

async function compare(funcName) {
  const pcss = fs.readFileSync(path.join(SPECS_DIR, `${funcName}.pcss`), `utf8`);
  const css = fs.readFileSync(path.join(SPECS_DIR, `${funcName}.css`), `utf8`);
  const src = await postcss([cssnano]).process(css, { from: undefined });
  const dist = await postcss([postlude, cssnano]).process(pcss, { from : undefined });

  if (src.css !== dist.css) {
    const message = `Unexpected post-processed results\n       Expectation: ${src.css}\n           Reality: ${dist.css}`;
    throw new Error(message);
  }
}

describe(`postlude`, function() {
  const funcNames = fs.readdirSync(SPECS_DIR).reduce((arr, val) => {
    if (!val.endsWith(`.pcss`)) return arr;
    arr.push(path.basename(val, `.pcss`));
    return arr;
  }, []);

  funcNames.forEach(funcName => {
    it(funcName, async function() {
      await compare(funcName);
    });
  });
});

