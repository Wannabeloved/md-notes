import { use } from "react";
import { TextField } from "@mui/material";
import { DBContext } from "../providers/DBProvider";

export function Editor() {
  const [{ file, setTitle, setText }] = use(DBContext) ?? [{}];

  return (
    typeof file?.text === "string" &&
    setText && (
      <TextField
        id="outlined-multiline-static"
        label="Your Markdown"
        autoFocus
        multiline
        rows={4}
        value={file?.text}
        onChange={(e: any) => setText?.(e.target.value)}
        sx={{ width: "100%" }}
      />
    )
  );
}
