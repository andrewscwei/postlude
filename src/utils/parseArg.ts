import assert from 'assert'

/**
 * Parses a list of arguments, returns the first matched argument that is whitelisted. If no matched
 * argument is found, `undefined` is returned.
 *
 * @param args - A list of string arguments.
 * @param whitelist - A list of whitelisted arguments.
 *
 * @returns The matched argument, else `undefined`.
 */
function parseArg(args: string[], whitelist: string[]): string | undefined

/**
 * Parses a list of arguments, returns the first matched argument that is whitelisted. If no matched
 * argument is found, an optional default value is returned, otherwise `undefined` is returned.
 *
 * @param args - A list of string arguments.
 * @param whitelist - A list of whitelisted arguments.
 * @param defaultValue - The default value to return if a matched argument cannot be found.
 *
 * @returns The matched argument, else the default value, else `undefined`.
 */
function parseArg(args: string[], whitelist: string[], defaultValue: string): string
function parseArg(args: string[], whitelist: string[], defaultValue?: string): string | undefined {
  if (whitelist.length <= 0) return defaultValue

  const matches: string[] = []

  for (const item of whitelist) {
    if (args.includes(item)) matches.push(item)
  }

  if (matches.length === 0) return defaultValue

  assert(matches.length === 1, 'More than 1 match found for the target argument')

  return matches[0]
}

export default parseArg
