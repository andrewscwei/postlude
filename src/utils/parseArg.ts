import assert from 'assert'

function parseArg(args: string[], whitelist: string[]): string | undefined
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
