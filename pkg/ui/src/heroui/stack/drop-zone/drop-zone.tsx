/**
 * Native DropZone polyfill (Pressable + compound slots).
 * Web uses `@heroui-pro/react/drop-zone` via `drop-zone.web.tsx`.
 */
import type {ComponentProps, ReactNode} from 'react';
import {Pressable, Text, View} from 'react-native';
import {Button} from '../../core/button';
import {compound} from '../../utils/compound';

type DropZoneRootProps = {
  className?: string;
  children?: ReactNode;
};

function DropZoneRoot({className, children}: DropZoneRootProps) {
  return <View className={className ?? 'gap-4'}>{children}</View>;
}

type DropZoneAreaProps = {
  children?: ReactNode;
  className?: string;
  isDisabled?: boolean;
  onPress?: () => void;
};

function DropZoneArea({children, className, isDisabled, onPress}: DropZoneAreaProps) {
  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      className={
        className ??
        'items-center gap-3 rounded-3xl border border-dashed border-border bg-surface-secondary p-8'
      }>
      {children}
    </Pressable>
  );
}

function DropZoneIcon({children}: {children?: ReactNode}) {
  return (
    <View className="items-center justify-center">
      {children ?? <Text className="text-3xl text-muted">↑</Text>}
    </View>
  );
}

function DropZoneLabel({children}: {children: ReactNode}) {
  return <Text className="text-base font-semibold text-foreground">{children}</Text>;
}

function DropZoneDescription({children}: {children: ReactNode}) {
  return <Text className="text-center text-sm text-muted">{children}</Text>;
}

type DropZoneTriggerProps = ComponentProps<typeof Button> & {
  children: ReactNode;
};

function DropZoneTrigger({children, ...props}: DropZoneTriggerProps) {
  return (
    <Button {...props}>
      {children}
    </Button>
  );
}

function DropZoneInput(_props: Record<string, unknown>) {
  return null;
}

function DropZoneFileList({children}: {children?: ReactNode}) {
  return <View className="gap-3">{children}</View>;
}

type FileItemStatus = 'uploading' | 'complete' | 'failed';

type DropZoneFileItemProps = {
  children?: ReactNode;
  status?: FileItemStatus;
  className?: string;
};

function DropZoneFileItem({children, status, className}: DropZoneFileItemProps) {
  const borderClass =
    status === 'failed' ? 'border border-danger/40' : 'border border-border/60';

  return (
    <View className={`gap-3 rounded-2xl bg-surface-secondary p-4 ${borderClass} ${className ?? ''}`}>
      <View className="flex-row items-start gap-3">{children}</View>
    </View>
  );
}

type FileFormatColor = 'blue' | 'gray' | 'green' | 'orange' | 'purple' | 'red';

const formatColors: Record<FileFormatColor, string> = {
  blue: 'bg-blue-500/20 text-blue-400',
  gray: 'bg-gray-500/20 text-gray-400',
  green: 'bg-green-500/20 text-green-400',
  orange: 'bg-orange-500/20 text-orange-400',
  purple: 'bg-purple-500/20 text-purple-400',
  red: 'bg-red-500/20 text-red-400',
};

function DropZoneFileFormatIcon({
  format,
  color = 'gray',
}: {
  format: string;
  color?: FileFormatColor;
}) {
  return (
    <View
      className={`h-10 w-10 items-center justify-center rounded-xl ${formatColors[color]}`}>
      <Text className="text-[10px] font-bold">{format.slice(0, 4)}</Text>
    </View>
  );
}

function DropZoneFileInfo({children}: {children?: ReactNode}) {
  return <View className="min-w-0 flex-1 gap-1">{children}</View>;
}

function DropZoneFileName({children}: {children: ReactNode}) {
  return (
    <Text className="text-sm font-semibold text-foreground" numberOfLines={1}>
      {children}
    </Text>
  );
}

function DropZoneFileMeta({children}: {children: ReactNode}) {
  return <Text className="text-xs text-muted">{children}</Text>;
}

function DropZoneFileProgress({children, value}: {children?: ReactNode; value?: number}) {
  return (
    <View className="mt-2 gap-1">
      {children}
      {value != null ? (
        <Text className="text-xs text-muted">{Math.round(value)}%</Text>
      ) : null}
    </View>
  );
}

function DropZoneFileProgressTrack({children}: {children?: ReactNode}) {
  return (
    <View className="h-1.5 overflow-hidden rounded-full bg-default">
      {children}
    </View>
  );
}

function DropZoneFileProgressFill({value}: {value?: number}) {
  const width = Math.max(0, Math.min(100, value ?? 0));
  return <View className="h-full rounded-full bg-accent" style={{width: `${width}%`}} />;
}

type DropZoneFileRemoveTriggerProps = ComponentProps<typeof Button> & {
  'aria-label'?: string;
};

function DropZoneFileRemoveTrigger({className, ...props}: DropZoneFileRemoveTriggerProps) {
  return (
    <Button
      {...props}
      size="sm"
      variant="ghost"
      className={className ?? 'min-w-8 px-2'}
    />
  );
}

export const DropZone = compound(DropZoneRoot, {
  Area: DropZoneArea,
  Icon: DropZoneIcon,
  Label: DropZoneLabel,
  Description: DropZoneDescription,
  Trigger: DropZoneTrigger,
  Input: DropZoneInput,
  FileList: DropZoneFileList,
  FileItem: DropZoneFileItem,
  FileFormatIcon: DropZoneFileFormatIcon,
  FileInfo: DropZoneFileInfo,
  FileName: DropZoneFileName,
  FileMeta: DropZoneFileMeta,
  FileProgress: DropZoneFileProgress,
  FileProgressTrack: DropZoneFileProgressTrack,
  FileProgressFill: DropZoneFileProgressFill,
  FileRemoveTrigger: DropZoneFileRemoveTrigger,
});
