import {View} from 'react-native';
import {Button} from '@/components/ui/Button';
import {Body, Muted, Small} from '@/components/base/text';
import {formatBytes} from '@/lib/pickers';
import type {LocalUpload} from '@/lib/db/local.types';
import {uploadManager} from '@/lib/storage/manager';

type Props = {
  upload: LocalUpload;
};

function UploadProgressBar({value}: {value: number}) {
  const clamped = Math.max(0, Math.min(1, value));
  return (
    <View className="h-2 overflow-hidden rounded-full bg-default">
      <View className="h-full rounded-full bg-accent" style={{width: `${clamped * 100}%`}} />
    </View>
  );
}

export function FileProgressItem({upload}: Props) {
  const progress = upload.size > 0 ? upload.bytes_uploaded / upload.size : 0;
  const isActive = upload.status === 'uploading';
  const isPaused = upload.status === 'paused';
  const isDone = upload.status === 'completed';
  const isFailed = upload.status === 'failed';

  return (
    <View className="gap-3 rounded-2xl bg-surface-secondary p-4">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Small className="font-semibold">{upload.name}</Small>
          <Muted>
            {formatBytes(upload.bytes_uploaded)} / {formatBytes(upload.size)}
          </Muted>
        </View>
        <Body className="capitalize text-muted">{upload.status}</Body>
      </View>

      <UploadProgressBar value={isDone ? 1 : progress} />
      <Muted>{Math.round((isDone ? 1 : progress) * 100)}%</Muted>

      {upload.error ? <Muted className="text-danger">{upload.error}</Muted> : null}

      {!isDone && !isFailed ? (
        <View className="flex-row gap-2">
          {isActive ? (
            <Button size="sm" variant="secondary" onPress={() => uploadManager.pause(upload.id)}>
              Pause
            </Button>
          ) : (
            <Button size="sm" variant="secondary" onPress={() => uploadManager.resume(upload.id)}>
              {isPaused ? 'Resume' : 'Start'}
            </Button>
          )}
          <Button size="sm" variant="ghost" onPress={() => uploadManager.cancel(upload.id)}>
            Cancel
          </Button>
        </View>
      ) : null}
    </View>
  );
}
