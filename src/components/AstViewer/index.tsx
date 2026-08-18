import { Tree } from "web-tree-sitter";

export function AstViewer({ parsedTree }: { parsedTree: Tree }) {
  return <div>
    <pre>{parsedTree.rootNode.toString().replaceAll(' ', '\n')}</pre>
  </div>
}