const postcss = require(`postcss`);

module.exports = function(decl) {
  const rule = postcss.rule({ selector: `&` });
  rule.append({ prop: `overflow`, value: `hidden` });
  rule.append({ prop: `-webkit-mask-image`, value: `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC)` });
  decl.replaceWith(rule);
};