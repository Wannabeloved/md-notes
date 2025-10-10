import { createContext, ReactNode, use, useEffect, useState } from "react";
import { Language, Node, Parser, Tree } from "web-tree-sitter";
import { DBContext } from "./DBProvider";

async function initTreeSitter(setParser: any, setInlineParser: any) {
  await Parser.init({
    locateFile(scriptName: string) {
      return scriptName;
    },
  });
  const parser = new Parser();
  const Markdown = await Language.load("/tree-sitter-markdown.wasm");
  parser.setLanguage(Markdown);
  setParser(parser);

  const inlineParser = new Parser();
  const MarkdownInline = await Language.load("/tree-sitter-markdown_inline.wasm");
  inlineParser.setLanguage(MarkdownInline);
  setInlineParser(inlineParser);
}
function getInlineTree(node: Node, parseInline: ($: string) => Tree) {
  const inlineTree = parseInline(node.text);
  return inlineTree;
}

function parse(
  parser: Parser,
  sourceCode: string,
  setTree: (tree: ReturnType<Parser["parse"]>) => void,
) {
  const mdTree = parser.parse(sourceCode);

  const tree = mdTree;
  setTree(mdTree);

  console.log(tree?.rootNode.children);
  const cursor = tree?.rootNode.walk();
  console.log("cursor.currentNode.text:", cursor?.currentNode.text);
  console.log("cursor?.gotoNextSibling():", JSON.stringify(cursor));
  while (cursor?.gotoNextSibling()) {
    console.log("cursor.currentNode.text:", cursor?.currentNode.text);
  }
}

export const Context2 = createContext<{
  parser: Parser | null;
  parseInline: (_: Node) => Tree;
  tree: ReturnType<Parser["parse"]> | null;
} | null>(null);

export function TSProvider({ children }: { children: ReactNode }) {
  const [current] = use(DBContext) ?? [];
  const text = current?.file?.text;
  const [parser, setParser] = useState<Parser | null>(null);
  const [inlineParser, setInlineParser] = useState<Parser | null>(null);
  const [tree, setTree] = useState<ReturnType<Parser["parse"]> | null>(null);
  useEffect(() => {
    initTreeSitter(setParser, setInlineParser);
  }, []);
  useEffect(() => {
    parser && typeof text === "string" && parse(parser, text, setTree);
  }, [parser, text]);

  return (
    <Context2
      value={{ parser, parseInline: $ => getInlineTree($, $ => inlineParser!.parse($)), tree }}>
      {children}
    </Context2>
  );
}
