export type FileTitle = string;
export interface File {
  title: FileTitle;
  text: string;
}
export type DBFileId = number;
export interface DBFile extends File {
  id: DBFileId;
}
export type Files = File[];
export type DBFiles = DBFile[];

export type DB = {
  files: () => Promise<DBFiles>;
  createFile: (
    title: FileTitle,
  ) => Promise<{ id: DBFileId; getFile: () => Promise<DBFile | undefined> }>;
  deleteFile: (id: DBFileId) => void;
};
export type Current = {
  file?: DBFile;
  setTitle?: (title: string) => void;
  setText?: (text: string) => void;
  setCurrentFile: (id: DBFileId) => void;
};
export type CT = [Current, DB];
