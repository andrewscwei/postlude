const minSize = 0;

const maxSize = 100000;

const breakpoints = {
  mobile: 639,
  tablet: 1023,
  notebook: 1439,
  desktop: 1919,
  tv: maxSize
};

function isBreakpoint(val) {
  return breakpoints[val] !== undefined;
}

function isOrientation(val) {
  return val === `portrait` || val === `landscape`;
}

function getLengthNameByShortName(val) {
  switch (val) {
  case `h`: return `height`;
  default: return `width`;
  }
}

function getBreakpointMin(breakpoint) {
  if (breakpoints[breakpoint] === undefined) return minSize;

  const t = Object.keys(breakpoints);
  const i = t.indexOf(breakpoint);

  if (i - 1 < 0) return minSize;

  return breakpoints[t[i-1]] + 1;
}

function getBreakpointMax(breakpoint) {
  if (breakpoints[breakpoint] === undefined) return maxSize;
  return breakpoints[breakpoint];
}

/**
 * Clearfix hack for floated elements.
 *
 * @param {AtRule} atRule - @see module:postcss.AtRule
 * @param {boolean} descriptor - Strings formatted by either '{base}{operator}{length_or_device_type}'
 *                               or '{orientation}'. If no {base} is specified,
 *                               width will be used.
 *
 * @example
 *   @post media('w<200px') { ... } // or
 *   @post media('<200px') { ... } // or
 *   @post media('<200px') { ... }
 *
 *   // @media (max-width: 199px) { ... }
 *
 * @example
 *   @post media('h>=tablet') { ... }
 *
 *   // @media (min-height: 640px) { ... }
 *
 * @example
 *   @post media('w=tablet') { ... }
 *
 *   // @media screen and (min-width: 640px) and (max-width: 1023px) { ... }
 */
module.exports = function(atRule, descriptor) {
  const regex = new RegExp(`(w|h)?(>=|<=|>|<|=)?(${Object.keys(breakpoints).join(`|`)}|landscape|portrait|[0-9]+px)?`);
  const matches = descriptor.match(regex);

  const base = getLengthNameByShortName(matches[1]);
  const operator = matches[2] || `=`;
  const device = matches[3];
  const [_, value, unit] = device.match(/([0-9]+)?(.*)?/);

  let params = `(`;

  if (isOrientation(device)) {
    params += `orientation: ${device}`;
  }
  else {
    switch (operator) {
    case `>`:
      params += `min-${base}: `;
      params += isBreakpoint(device) ? `${Math.min(maxSize, getBreakpointMax(device) + 1)}px` : `${(Number(value) || 0) + 1}${unit || `px`}`;
      break;
    case `>=`:
      params += `min-${base}: `;
      params += isBreakpoint(device) ? `${getBreakpointMin(device)}px` : `${Number(value) || 0}${unit || `px`}`;
      break;
    case `<`:
      params += `max-${base}: `;
      params += isBreakpoint(device) ? `${Math.max(minSize, getBreakpointMin(device) - 1)}px` : `${(Number(value) || maxSize) - 1}${unit || `px`}`;
      break;
    case `<=`:
      params += `max-${base}: `;
      params += isBreakpoint(device) ? `${getBreakpointMax(device)}px` : `${Number(value) || 0}${unit || `px`}`;
      break;
    case `=`:
      params += `min-${base}: `;
      params += isBreakpoint(device) ? `${getBreakpointMin(device)}px` : `${Number(value) || 0}${unit || `px`}`;
      params += `) and (`;
      params += `max-${base}: `;
      params += isBreakpoint(device) ? `${getBreakpointMax(device)}px` : `${Number(value) || 0}${unit || `px`}`;
      break;
    }
  }

  params += `)`;

  atRule.name = `media`;
  atRule.params = params;
};
