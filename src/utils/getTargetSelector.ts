import { Node, Rule } from 'postcss'

export default function getTargetSelector(node?: Node): string | undefined {
  switch (node?.parent?.type) {
    case 'atrule':
      return getTargetSelector(node.parent)
    case 'rule':
      return (node.parent as Rule).selector
    default:
      return undefined
  }
}
