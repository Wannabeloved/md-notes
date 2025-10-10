import { use, useEffect, useState } from "react";

import { TreeCursor } from "web-tree-sitter";
// import { Context } from "../providers/HighlightProvider";
import { Context2 } from "../providers/TSProvider";
import { AstViewer } from "../components/AstViewer";
// import { Preview } from "../components/Preview";
import { Editor } from "../components/Editor";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import SplitButton from "../components/SplitButton";
import { useParams } from "react-router";
import { DBContext } from "../providers/DBProvider";

export function EditorPage() {
  // const [highlighted, setHighlighted] = use(Context) ?? [];
  const { tree: parsedTree } = use(Context2) ?? {};

  const [treeCursor, setTreeCursor] = useState<TreeCursor | null>(null);

  const db = use(DBContext);
  const { id } = useParams();
  console.log("id: ", id);
  useEffect(() => {
    if (db && id) db[0].setCurrentFile(+id);
  }, [id]);

  // function getClosestMdNode(node: Node): string {
  //   const el = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
  //   if (!el) return "";

  //   return el.closest(`[data-id]`);
  // }

  useEffect(() => {
    setTreeCursor(parsedTree?.walk() ?? null);
  }, [parsedTree]);

  // useEffect(() => {
  //   document.addEventListener("selectionchange", ({ target }) => {
  //     console.log("target: ", target);
  //     console.log("document.getSelection(): ", document.getSelection());
  //     console.dir(document.getSelection()?.focusNode);

  //     const node = document.getSelection()?.focusNode;
  //     if (node) {
  //       console.log("closest");
  //       console.dir(getClosestMdNode(node));
  //       setHighlighted?.(getClosestMdNode(node).dataset.id);
  //     }
  //   });
  // }, []);
  const [tab, setTab] = useState<0 | 1>(0);

  const handleChange = (_: React.SyntheticEvent, newValue: typeof tab) => {
    setTab(newValue);
  };

  return (
    <Grid container spacing={2}>
      <Grid size={8}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tab} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Editor" {...a11yProps(0)} />
            <Tab label="Preview" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={tab} index={0}>
          <Editor />
        </CustomTabPanel>
        <CustomTabPanel value={tab} index={1}>
          <Box sx={{ textAlign: "center" }}>
            <SplitButton />
          </Box>
          {/* {treeCursor && <Preview treeCursor={treeCursor} />} */}
        </CustomTabPanel>
      </Grid>
      <Grid size={4}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            height: "49px",
            textAlign: "center",
            alignContent: "center",
          }}>
          <Typography component={"h2"}>AST</Typography>
        </Box>
        {parsedTree ? <AstViewer parsedTree={parsedTree} /> : <p>Loading parser...</p>}
      </Grid>
    </Grid>
  );
}

interface TabPanelProps<T, V extends T> {
  children?: React.ReactNode;
  index: T;
  value: V;
}

function CustomTabPanel<T, V extends T>(props: TabPanelProps<T, V>) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps<T>(index: T) {
  return {
    "id": `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
