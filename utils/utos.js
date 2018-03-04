module.exports = function utos(t) {
  const out = `${t.value}${t.unit === undefined ? `` : t.unit}`;
  return out;
};