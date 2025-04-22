import { CanvasType } from "@/types/CanvasType";
import { ElementComponent } from "@/types/Element.type";
import { openDB, IDBPDatabase } from "idb";

const DB_NAME = "mini-canva-db";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

const getDB = async () => {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB only available in the browser");
  }

  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("designs")) {
          db.createObjectStore("designs");
        }
        if (!db.objectStoreNames.contains("images")) {
          db.createObjectStore("images");
        }
        if (!db.objectStoreNames.contains("canvas")) {
          db.createObjectStore("canvas");
        }
        if (!db.objectStoreNames.contains("projects")) {
          db.createObjectStore("projects");
        }
      },
    });
  }

  return dbPromise;
};

export const saveElements = async (elements: ElementComponent[]) => {
  const db = await getDB();
  await db.put("elements", elements, "all");
};


export const getElements = async (): Promise<ElementComponent[] | null> => {
  const db = await getDB();
  return await db.get("elements", "all");
};

export const saveImageBlob = async (id: number, blob: Blob) => {
  const db = await getDB();
  await db.put("images", blob, id.toString());
};

export const getImageBlob = async (id: number): Promise<Blob | undefined> => {
  const db = await getDB();
  return await db.get("images", id.toString());
};

export const deleteImageBlob = async (id: number) => {
  const db = await getDB();
  await db.delete("images", id.toString());
};

export const clearAll = async () => {
  const db = await getDB();
  await db.clear("elements");
  await db.clear("images");
};


export const createDesign = async (designId: string, canvas: CanvasType) => {
  const db = await getDB();
  await db?.put("canvas", canvas, designId);
};

export const saveDesign = async (designId: string, elements: ElementComponent[]) => {
  const db = await getDB();
  await db?.put("designs", elements, designId);
};

export const saveCanvas = async (designId: string, canvas: CanvasType) => {
  const db = await getDB();
  await db?.put("canvas", canvas, designId);
};

export const saveProjects = async (designId: string, project: string) => {
  const db = await getDB();
  await db?.put("projects", project, designId);
};

export const loadDesign = async (designId: string): Promise<ElementComponent[] | null> => {
  const db = await getDB();
  return await db?.get("designs", designId);
};

export const loadCanvas= async (designId: string): Promise<CanvasType | null> => {
  const db = await getDB();
  return await db?.get("canvas", designId);
};

export const loadProject = async (designId: string): Promise<string> => {
  const db = await getDB();
  return await db?.get("projects", designId);
};


