'use client';

import type {ReactNode} from 'react';
import type {ControlFieldProps} from './types';

import {View} from 'react-native';
import {compound} from '../../utils/compound';

/**
 * Web polyfill: layout row for settings-style controls.
 * Prefer Switch/Checkbox with Label on web forms.
 */
function ControlFieldRoot({className, children}: ControlFieldProps & {children?: ReactNode}) {
  return (
    <View className={className ?? 'flex-row items-center justify-between gap-3'}>
      {children}
    </View>
  );
}

function ControlFieldIndicator({children}: {children?: ReactNode}) {
  return <>{children}</>;
}

export const ControlField = compound(ControlFieldRoot, {
  Indicator: ControlFieldIndicator,
});

export function useControlField(): never {
  throw new Error('useControlField is native-only.');
}

export type {ControlFieldProps} from './types';
