import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import {Directory, File, Paths} from 'expo-file-system';
import {isMimeAllowed, loadSettings} from '@/lib/settings';

export type PickedFile = {
  id: string;
  name: string;
  size: number;
  mime: string;
  uri: string;
  stagedUri: string;
};

export async function pickDocuments(): Promise<PickedFile[]> {
  const result = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
    multiple: true,
  });

  if (result.canceled) return [];

  const picked: PickedFile[] = [];
  for (const asset of result.assets) {
    const normalized = await normalizeAsset({
      uri: asset.uri,
      name: asset.name,
      size: asset.size,
      mime: asset.mimeType,
    });
    if (normalized) picked.push(normalized);
  }
  return picked;
}

export async function pickMedia(): Promise<PickedFile[]> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Media library permission is required to pick photos and videos.');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images', 'videos'],
    allowsMultipleSelection: true,
    quality: 1,
  });

  if (result.canceled) return [];

  const picked: PickedFile[] = [];
  for (const asset of result.assets) {
    const name = asset.fileName ?? `media-${Date.now()}.jpg`;
    const normalized = await normalizeAsset({
      uri: asset.uri,
      name,
      size: asset.fileSize,
      mime: asset.mimeType,
    });
    if (normalized) picked.push(normalized);
  }
  return picked;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

export function stripFileScheme(uri: string): string {
  return uri.replace(/^file:\/\//, '');
}

async function ensureStagingDir(): Promise<Directory> {
  const dir = new Directory(Paths.document, 'staging');
  if (!dir.exists) {
    dir.create({intermediates: true});
  }
  return dir;
}

async function stageFile(sourceUri: string, fileId: string, name: string): Promise<string> {
  const staging = await ensureStagingDir();
  const safeName = name.replace(/[/\\]/g, '_');
  const dest = new File(staging, `${fileId}-${safeName}`);
  const source = new File(sourceUri);
  if (dest.exists) {
    dest.delete();
  }
  source.copy(dest);
  return dest.uri;
}

async function normalizeAsset(input: {
  uri: string;
  name: string;
  size?: number | null;
  mime?: string | null;
}): Promise<PickedFile | null> {
  const settings = await loadSettings();
  const mime = inferMime(input.name, input.mime);
  if (!isMimeAllowed(mime, settings)) {
    return null;
  }
  
  const fileId = crypto.randomUUID();
  const source = new File(input.uri);
  const size = input.size ?? source.size ?? 0;
  const stagedUri = await stageFile(input.uri, fileId, input.name);
  
  return {
    id: fileId,
    name: input.name,
    size,
    mime,
    uri: input.uri,
    stagedUri,
  };
}

function inferMime(name: string, fallback?: string | null): string {
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
