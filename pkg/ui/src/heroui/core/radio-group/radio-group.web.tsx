'use client';

import {Radio, RadioGroup as WebRadioGroup} from '@heroui/react';
import {withWebAliases} from '../../utils/web-aliases';

/** Web radios use `Radio`; native uses `RadioGroup.Item`. */
export const RadioGroup = withWebAliases(WebRadioGroup, {
  Item: Radio,
});

export function useRadioGroup(): never {
  throw new Error('useRadioGroup is native-only.');
}
