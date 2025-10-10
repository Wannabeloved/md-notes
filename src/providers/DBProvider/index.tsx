import { createContext, useState, type ReactNode } from "react";

import Dexie, { type EntityTable } from "dexie";

import type { DBFile, File, FileTitle, CT } from "./types.ts";
export type { File, DBFile };

const db = new Dexie("FilesDatabase") as Dexie & {
  files: EntityTable<
    DBFile,
    "id" // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  files: "++id, title, text", // primary key "id" (for the runtime!)
});

export { db };

export const DBContext = createContext<CT | null>(null);

export function DBProvider({ children }: { children: ReactNode }) {
  const [file, setFile] = useState<DBFile>();

  const current: CT[0] = {
    file,
    setTitle: createSetTitle(),
    setText: createSetText(),
    setCurrentFile: id => {
      db.files.get(id).then(v => v?.id !== file?.id && setFile(v));
    },
  };

  return (
    <DBContext
      value={[
        current,
        {
          files: () => db.files.toArray(),
          createFile: async title => {
            const id = await db.files.add(createDefaultFile(title));
            return { id, getFile: () => db.files.get(id).then($ => $) };
          },
          deleteFile: () => {},
        },
      ]}>
      {children}
    </DBContext>
  );
  function createSetTitle(): CT[0]["setTitle"] {
    return (
      file &&
      (title => {
        setFile(prev => ({
          ...prev!,
          title,
        }));
      })
    );
  }
  function createSetText(): CT[0]["setText"] {
    return (
      file &&
      (async text => {
        setFile(prev => ({
          ...prev!,
          text,
        }));
        await db.files.update(file!.id, { text: text });
      })
    );
  }
  function createDefaultFile(title: FileTitle): File {
    return {
      title,
      text: ``,
    };
  }
}
