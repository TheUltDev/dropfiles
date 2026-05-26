import type {LocalUpload} from '@/lib/db/local.types';
import {useCallback, useRef, useSyncExternalStore} from 'react';

type UploadStoreSnapshot = {
  uploads: LocalUpload[];
  version: number;
};

let snapshot: UploadStoreSnapshot = {
  uploads: [],
  version: 0,
};

const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) {
    listener();
  }
}

export function setUploads(uploads: LocalUpload[]): void {
  snapshot = {uploads: [...uploads], version: snapshot.version + 1};
  emit();
}

export function patchUploadInStore(id: string, patch: Partial<LocalUpload>): void {
  snapshot = {
    uploads: snapshot.uploads.map((upload) =>
      upload.id === id ? {...upload, ...patch} : upload,
    ),
    version: snapshot.version + 1,
  };
  emit();
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getUploadStoreSnapshot(): UploadStoreSnapshot {
  return snapshot;
}

export function useUploadStore<T>(selector: (state: UploadStoreSnapshot) => T): T {
  const selectorRef = useRef(selector);
  selectorRef.current = selector;

  const cacheRef = useRef<{version: number; value: T}>({
    version: -1,
    value: selector(getUploadStoreSnapshot()),
  });

  const getSnapshot = useCallback((): T => {
    const current = getUploadStoreSnapshot();
    if (cacheRef.current.version === current.version) {
      return cacheRef.current.value;
    }

    const value = selectorRef.current(current);
    cacheRef.current = {version: current.version, value};
    return value;
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useActiveUploads(): LocalUpload[] {
  return useUploadStore((state) =>
    state.uploads.filter((upload) =>
      ['pending', 'uploading', 'paused'].includes(upload.status),
    ),
  );
}

export function useDropUploads(dropId: string): {uploads: LocalUpload[]} {
  const uploads = useUploadStore(state => state.uploads
    .filter(upload => upload.drop_id === dropId)
  );
  return {uploads};
}
