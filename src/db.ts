import Dexie, { type EntityTable } from "dexie";

export interface Image {
  id: number;
  file: File;
  processedFile?: File | null | string;
  name?: string;
}

export const db = new Dexie("NoMoreBgDb") as Dexie & {
  images: EntityTable<Image, "id">;
};

db.version(1).stores({
  images: "++id, file, processedFile",
});
