import {isMimeAllowed, loadSettings} from '@/lib/settings';

export type PickedFile = {
  id: string;
  name: string;
  size: number;
  mime: string;
  uri: string;
  stagedUri: string;
  blob?: Blob;
};

function inferMime(name: string, fallback?: string): string {
  if (fallback) return fallback;
  const ext = name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'mp4':
      return 'video/mp4';
    case 'mov':
      return 'video/quicktime';
    case 'pdf':
      return 'application/pdf';
    case 'zip':
      return 'application/zip';
    default:
      return 'application/octet-stream';
  }
}

async function normalizeFile(file: File): Promise<PickedFile | null> {
  const settings = await loadSettings();
  const mime = inferMime(file.name, file.type);
  if (!isMimeAllowed(mime, settings)) return null;

  const id = crypto.randomUUID();
  const objectUrl = URL.createObjectURL(file);

  return {
    id,
    name: file.name,
    size: file.size,
    mime,
    uri: objectUrl,
    stagedUri: objectUrl,
    blob: file,
  };
}

export async function pickFromFileList(fileList: FileList | File[]): Promise<PickedFile[]> {
  const files = Array.from(fileList);
  const picked: PickedFile[] = [];
  for (const file of files) {
    const normalized = await normalizeFile(file);
    if (normalized) picked.push(normalized);
  }
  return picked;
}

export async function pickDocuments(): Promise<PickedFile[]> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = async () => {
      try {
        if (!input.files?.length) {
          resolve([]);
          return;
        }
        resolve(await pickFromFileList(input.files));
      } catch (error) {
        reject(error);
      }
    };
    input.click();
  });
}

export async function pickMedia(): Promise<PickedFile[]> {
  return pickDocuments();
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

export function stripFileScheme(uri: string): string {
  return uri;
}
