import type {PickedFile} from '@/lib/pickers';

import {useState} from 'react';
import {View} from 'react-native';
import {Body, Muted, Small} from '@/components/base/text';
import {formatBytes, pickDocuments, pickMedia} from '@/lib/pickers';
import {Button} from '@workspace/ui';

type Props = {
  files: PickedFile[];
  maxFiles: number;
  onChange: (files: PickedFile[]) => void;
};

export function FilePickerSheet({files, maxFiles, onChange}: Props) {
  const [error, setError] = useState<string | null>(null);

  const mergePicked = (picked: PickedFile[]) => {
    const merged = [...files, ...picked].slice(0, maxFiles);
    if (files.length + picked.length > maxFiles) {
      setError(`Only ${maxFiles} file(s) allowed for this drop.`);
    }
    onChange(merged);
  };

  const handlePick = async (kind: 'documents' | 'media') => {
    try {
      setError(null);
      const picked = kind === 'documents' ? await pickDocuments() : await pickMedia();
      await mergePicked(picked);
    } catch (pickError) {
      setError(pickError instanceof Error ? pickError.message : 'Failed to pick files');
    }
  };

  const removeFile = (id: string) => {
    onChange(files.filter((file) => file.id !== id));
  };

  return (
    <View className="gap-4">
      <View className="items-center gap-3 rounded-3xl border border-dashed border-border bg-surface-secondary p-8">
        <Body className="font-semibold">
          Add files to your drop
        </Body>
        <Muted className="text-center">
          Pick documents or media to upload with resume support.
        </Muted>
        <Button onPress={() => void handlePick('documents')}>
          Choose files
        </Button>
        <Button variant="secondary" onPress={() => void handlePick('media')}>
          Photos & videos
        </Button>
      </View>
      {error ? <Muted className="text-danger">{error}</Muted> : null}
      <View className="gap-2">
        {files.length === 0 ? (
          <View className="rounded-2xl border border-dashed border-border p-6">
            <Muted className="text-center">
              No files selected yet.
            </Muted>
          </View>
        ) : (
          files.map((file) => (
            <View
              key={file.id}
              className="flex-row items-center justify-between rounded-2xl bg-surface-secondary px-4 py-3">
              <View className="flex-1 pr-3">
                <Small className="font-semibold">{file.name}</Small>
                <Muted>
                  {formatBytes(file.size)} · {file.mime}
                </Muted>
              </View>
              <Button size="sm" variant="ghost" onPress={() => removeFile(file.id)}>
                Remove
              </Button>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
