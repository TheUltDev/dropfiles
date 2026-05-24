import type {ReactNode} from 'react';
import {View} from 'react-native';
import {Description} from '../Description';
import {Label} from '../Label';

export type SettingRowProps = {
  title: string;
  description?: string;
  suffix?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function SettingRow({title, description, suffix, children, className}: SettingRowProps) {
  return (
    <View className={className ?? 'gap-2 rounded-2xl bg-surface-secondary px-4 py-3'}>
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-1">
          <Label>{title}</Label>
          {description ? <Description>{description}</Description> : null}
        </View>
        {suffix}
      </View>
      {children}
    </View>
  );
}
