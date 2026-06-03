import type {ComponentProps} from 'react';
import type {SwitchControlProps, SwitchProps, SwitchThumbProps} from './types';

import {Switch as NativeSwitch} from 'heroui-native';
import {compound} from '../../utils/compound';

function SwitchRoot(props: SwitchProps) {
  return <NativeSwitch {...(props as ComponentProps<typeof NativeSwitch>)} />;
}

/** Native switch has no separate control slot; marker for cross-platform compound API. */
function SwitchControl(_props: SwitchControlProps) {
  return null;
}

function SwitchThumb(props: SwitchThumbProps) {
  return (
    <NativeSwitch.Thumb {...(props as ComponentProps<typeof NativeSwitch.Thumb>)} />
  );
}

export const Switch = compound(SwitchRoot, {
  Control: SwitchControl,
  Thumb: SwitchThumb,
});
