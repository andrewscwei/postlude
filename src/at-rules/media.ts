import { AtRule } from 'postcss'

const MIN_SIZE = 0

const MAX_SIZE = 100_000

const BREAKPOINTS: Record<string, number> = {
  mobile: 639,
  tablet: 1024,
  notebook: 1439,
  desktop: 1919,
  tv: MAX_SIZE,
}

/**
 * Transforms a custom at-rule into a media query rule.
 *
 * @param atRule - The {@link AtRule} to transform.
 * @param descriptor - Strings formatted by either
 *                     `{length}{operator}{length_or_device_type}` or
 *                     `{orientation}`. If no `{length}` is specified, width
 *                     will be used.
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
export default function(atRule: AtRule, descriptor: string) {
  const regex = new RegExp(`(w|h)?(>=|<=|>|<|=)?(${Object.keys(BREAKPOINTS).join('|')}|landscape|portrait|[0-9]+px)?`)
  const matches = descriptor.match(regex)
  const length = getLengthNameByShortName(matches?.[1])
  const operator = matches?.[2] || '='
  const value = matches?.[3] ?? ''
  const [, amount, unit] = value?.match(/([0-9]+)?(.*)?/) ?? []

  let params = '('

  if (isOrientation(value)) {
    params += `orientation: ${value}`
  }
  else {
    switch (operator) {
      case '>':
        params += `min-${length}: `
        params += isBreakpoint(value) ? `${Math.min(MAX_SIZE, getBreakpointMax(value) + 1)}px` : `${(Number(amount) || 0) + 1}${unit || 'px'}`
        break
      case '>=':
        params += `min-${length}: `
        params += isBreakpoint(value) ? `${getBreakpointMin(value)}px` : `${Number(amount) || 0}${unit || 'px'}`
        break
      case '<':
        params += `max-${length}: `
        params += isBreakpoint(value) ? `${Math.max(MIN_SIZE, getBreakpointMin(value) - 1)}px` : `${(Number(amount) || MAX_SIZE) - 1}${unit || 'px'}`
        break
      case '<=':
        params += `max-${length}: `
        params += isBreakpoint(value) ? `${getBreakpointMax(value)}px` : `${Number(amount) || 0}${unit || 'px'}`
        break
      case '=':
        params += `min-${length}: `
        params += isBreakpoint(value) ? `${getBreakpointMin(value)}px` : `${Number(amount) || 0}${unit || 'px'}`
        params += ') and ('
        params += `max-${length}: `
        params += isBreakpoint(value) ? `${getBreakpointMax(value)}px` : `${Number(amount) || 0}${unit || 'px'}`
        break
      default:
        break
    }
  }

  params += ')'

  atRule.name = 'media'
  atRule.params = params
}

function isBreakpoint(val: string) {
  return BREAKPOINTS[val] !== undefined
}

function isOrientation(val: string) {
  return val === 'portrait' || val === 'landscape'
}

function getLengthNameByShortName(val?: string) {
  switch (val) {
    case 'h': return 'height'
    default: return 'width'
  }
}

function getBreakpointMin(breakpoint: string) {
  if (BREAKPOINTS[breakpoint] === undefined) return MIN_SIZE

  const t = Object.keys(BREAKPOINTS)
  const i = t.indexOf(breakpoint)

  if (i - 1 < 0) return MIN_SIZE

  return BREAKPOINTS[t[i - 1]] + 1
}

function getBreakpointMax(breakpoint: string) {
  if (BREAKPOINTS[breakpoint] === undefined) return MAX_SIZE

  return BREAKPOINTS[breakpoint]
}
