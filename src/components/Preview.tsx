import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { TreeCursor, Tree, Node as TSNode } from "web-tree-sitter";
import { Context2 } from "../providers/TSProvider";
import { use } from "react";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: "start",
  color: theme.palette.text.secondary,
  height: "fit-content",
  h1: {
    textAlign: "center",
  },
  minHeight: "60px",
  padding: "8px 12px",
  margin: "5px",
}));

export function Preview({ treeCursor }: { treeCursor: TreeCursor }) {
  const { parseInline } = use(Context2) ?? {};

  return <Item elevation={3}>{renderSiblings(treeCursor, parseInline!)}</Item>;
}
function* siblingsIterator(cursor: TreeCursor) {
  do {
    yield (console.log(cursor.copy()), cursor);
  } while (cursor?.gotoNextSibling());
}

const HEADINGS = {
  atx_h1_marker: "h1",
  atx_h2_marker: "h2",
  atx_h3_marker: "h3",
  atx_h4_marker: "h4",
  atx_h5_marker: "h5",
  atx_h6_marker: "h6",
};
type DefaultProps = { cursor: TreeCursor; key: any };

const COMPONENTS = {
  emphasis: ({ cursor }: DefaultProps) => {
    return <em>{cursor.nodeText}</em>;
  },
  hard_line_break: ({ cursor }: DefaultProps) => {
    return <br />;
  },
  strong_emphasis: ({ cursor }: DefaultProps, parseInline: (_: TSNode) => Tree) => {
    return <strong>{cursor.nodeText}</strong>;
  },
  paragraph: ({ cursor }: DefaultProps, parseInline: (_: TSNode) => Tree) => {
    return <p>{renderChildren(cursor, parseInline)}</p>;
  },
  inline: ({ cursor }: DefaultProps, parseInline: (_: TSNode) => Tree) => {
    const hasChildren = () => {
      const hasChildren = cursor.gotoFirstChild();
      if (hasChildren) cursor.gotoParent();
      return hasChildren;
    };
    return <>{hasChildren() ? renderChildren(cursor, parseInline) : cursor.nodeText}</>;
  },
  atx_heading: ({ cursor }: DefaultProps, parseInline: (_: TSNode) => Tree) => {
    const Type = typeOfHeading(cursor);
    return <Type>{renderChildren(cursor, parseInline)}</Type>;
  },
  atx_h1_marker: ({ cursor }: DefaultProps) => {
    return (
      // <span>
      //   { cursor.nodeText }
      // </span>
      null
    );
  },
  atx_h2_marker: ({ cursor }: DefaultProps) => {
    return (
      // <span> {cursor.nodeText} </span>
      null
    );
  },
  atx_h3_marker: ({ cursor }: DefaultProps) => {
    return (
      // <span> {cursor.nodeText} </span>
      null
    );
  },
  atx_h4_marker: ({ cursor }: DefaultProps) => {
    return (
      // <span> {cursor.nodeText} </span>
      null
    );
  },
  atx_h5_marker: ({ cursor }: DefaultProps) => {
    return (
      // <span> {cursor.nodeText} </span>
      null
    );
  },
  atx_h6_marker: ({ cursor }: DefaultProps) => {
    return (
      // <span> {cursor.nodeText} </span>
      null
    );
  },
  list: ({ cursor }: DefaultProps, parseInline: (_: TSNode) => Tree) => {
    const ListType = typeOfList(cursor);
    return <ListType>{renderChildren(cursor, parseInline)}</ListType>;
  },
  list_item: ({ cursor }: DefaultProps, parseInline: (_: TSNode) => Tree) => {
    return <li>{renderChildren(cursor, parseInline)}</li>;
  },
  list_marker_minus: ({ cursor }: DefaultProps) => null,
  list_marker_dot: ({ cursor }: DefaultProps) => null,
  task_list_marker_checked: ({ cursor }: DefaultProps) => {
    return <input type="checkbox" checked={true} disabled />;
  },
  task_list_marker_unchecked: ({ cursor }: DefaultProps) => {
    return <input type="checkbox" checked={false} disabled />;
  },
  section: ({ cursor }: DefaultProps, parseInline: (_: TSNode) => Tree) => {
    console.log("SECTION: ", cursor.nodeType);
    console.log(cursor.copy());

    return <section>{renderChildren(cursor, parseInline)}</section>;
  },
  document: ({ cursor }: DefaultProps, parseInline: (_: TSNode) => Tree) => {
    console.log("DOCUMENT: ");
    console.log(cursor);

    return <article>{renderChildren(cursor, parseInline)}</article>;
  },
};
function renderChildren(cursor: TreeCursor, parseInline: (_: TSNode) => Tree) {
  console.log("renderChildren: ", cursor.copy());
  return (
    cursor.gotoFirstChild() &&
    withEffect(
      () => renderSiblings(cursor, parseInline),
      () => cursor.gotoParent(),
    )
  );
}
function renderSiblings(cursor: TreeCursor, parseInline: (_: TSNode) => Tree) {
  console.log("renderSiblings: ", cursor.copy());
  console.log([...siblingsIterator(cursor.copy())]);
  return siblingsIterator(cursor)
    .map(sibling => {
      const type = sibling.nodeType;
      console.log("sibling: ", type);
      console.log(sibling.copy());

      if (!sibling?.nodeType) {
        console.log("false");
        return;
      }
      const Item = COMPONENTS[type];
      console.log(Item);

      if (type === "inline") {
        const inlineTree = parseInline(sibling.currentNode);
        const cursor = inlineTree.walk();
        const res = COMPONENTS[type]({ cursor, key: sibling.nodeId }, parseInline);
        cursor.delete();
        return res;
      }
      return COMPONENTS[type]({ cursor: sibling, type, key: sibling.nodeId }, parseInline);
    })
    .toArray();
}

function withEffect(f: any, e: any) {
  const fr = f();
  e();
  return fr;
}
function typeOfHeading(cursor: TreeCursor): "h1" | "h2" | "h3" | "h4" | "h5" | "h6" {
  return HEADINGS[cursor.currentNode.firstChild?.type || ""];
}
function typeOfList(listNode: TreeCursor): "ol" | "ul" {
  const marker = listNode.currentNode.firstChild?.firstChild;
  const type = marker?.type != "list_marker_minus" ? "ol" : "ul";

  return type;
}
