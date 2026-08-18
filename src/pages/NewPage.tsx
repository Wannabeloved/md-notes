import { Button, Stack, TextField, Typography } from "@mui/material";
import { DBContext } from "../providers/DBProvider";
import { use, useState } from "react";
import { useNavigate } from "react-router";
export function NewPage() {
  const [, db] = use(DBContext) ?? [];
  const [inputState, setInputState] = useState<{
    text: string;
    error: string | null;
  }>({
    text: "",
    error: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!db) return;

    setIsLoading(() => true);
    const existing = await db.files();
    if (existing === undefined) throw new Error("No files");
    console.log("creating file...");
    console.log(existing);
    const isExist = existing.some(({ text }) => text === inputState.text);

    setInputState(p => ({
      ...p,
      error: isExist ? "File already exist" : null,
      ...(!isExist && { text: "" }),
    }));
    setIsLoading(() => false);

    if (isExist) return;
    const { id } = await db.createFile(inputState.text);
    navigate(`/${id}`);
  }
  return (
    <>
      <Typography component={"p"} variant="h2" align="center">
        Ready for next Idea?
      </Typography>
      <br />
      <Stack
        component={"form"}
        onSubmit={handleSubmit}
        direction="row"
        spacing={2}
        sx={{ justifyContent: "center" }}>
        <TextField
          id="standard-basic"
          label="Title"
          variant="standard"
          value={inputState.text}
          onChange={e =>
            setInputState(prev => ({
              ...prev,
              text: e.target.value,
            }))
          }
        />
        <Button
          type="submit"
          variant="outlined"
          disabled={inputState.text.length <= 0}
          loading={isLoading}
          loadingPosition="end">
          Create Note
        </Button>
      </Stack>
    </>
  );
}
