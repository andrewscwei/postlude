const assert = require(`assert`);
const cssnano = require(`cssnano`);
const fs = require(`fs`);
const path = require(`path`);
const postcss = require(`postcss`);
const postlude = require(`../`);
const { describe, it } = require(`mocha`);

describe(`postlude`, function() {
  it(`margin`, async function() {
    const pcss = fs.readFileSync(path.join(__dirname, `files`, `margin.pcss`), `utf8`);
    const css = fs.readFileSync(path.join(__dirname, `files`, `margin.css`), `utf8`);
    const src = await postcss([cssnano]).process(css, { from: undefined });
    const dist = await postcss([postlude, cssnano]).process(pcss, { from : undefined });
    assert(src.css === dist.css);
  });
});

