const UNITS = [`em`, `ex`, `%`, `px`, `cm`, `mm`, `in`, `pt`, `pc`, `ch`, `rem`, `vh`, `vw`, `vmin`, `vmax`];

module.exports = function stou(t) {
  const match = t.match(/^(-?[0-9]*)(.*)$/);
  const out = {
    value: match[1] === `` ? 0 : Number(match[1]),
    unit: UNITS.includes(match[2]) ? match[2] : undefined
  };
  return out;
};