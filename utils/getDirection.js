const DIRECTION_TOP_TO_BOTTOM = [`v`, `column`, `down`, `vertical`];
const DIRECTION_RIGHT_TO_LEFT = [`<`, `row-reverse`, `left`];
const DIRECTION_BOTTOM_TO_TOP = [`^`, `column-reverse`, `up`];
const DIRECTION_LEFT_TO_RIGHT = [`>`, `row`, `right`, `row`];

module.exports = function(str) {
  if (DIRECTION_TOP_TO_BOTTOM.includes(str)) return DIRECTION_TOP_TO_BOTTOM[0];
  if (DIRECTION_RIGHT_TO_LEFT.includes(str)) return DIRECTION_RIGHT_TO_LEFT[0];
  if (DIRECTION_BOTTOM_TO_TOP.includes(str)) return DIRECTION_BOTTOM_TO_TOP[0];
  if (DIRECTION_LEFT_TO_RIGHT.includes(str)) return DIRECTION_LEFT_TO_RIGHT[0];
  return undefined;
};