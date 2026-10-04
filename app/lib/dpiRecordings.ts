export type StoredClip = {
  id: string;
  typeId: string;
  questionId: string;
  blob: Blob;
  mimeType: string;
  recordedAt: string;
};

const DB_NAME = "issb-dpi-recordings";
const STORE = "clips";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open recordings."));
  });
}

function done<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Recording store failed."));
  });
}

export async function listStoredClips(): Promise<StoredClip[]> {
  const db = await openDb();
  try {
    const rows = await done(db.transaction(STORE, "readonly").objectStore(STORE).getAll());
    return rows as StoredClip[];
  } finally {
    db.close();
  }
}

export async function saveStoredClip(clip: StoredClip): Promise<void> {
  const db = await openDb();
  try {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(clip);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error("Could not save the recording."));
      tx.onabort = () => reject(tx.error ?? new Error("Saving the recording was aborted."));
    });
  } finally {
    db.close();
  }
}

export async function deleteStoredClip(id: string): Promise<void> {
  const db = await openDb();
  try {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error ?? new Error("Could not delete the recording."));
      tx.onabort = () => reject(tx.error ?? new Error("Deleting the recording was aborted."));
    });
  } finally {
    db.close();
  }
}

export function preferredAudioMime(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const types = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/aac"];
  return types.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
}
