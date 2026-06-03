import type {ComponentProps} from 'react';
import type {Label as WebLabel} from '@heroui/react';
import type {Label as NativeLabel} from 'heroui-native';

export type LabelProps = ComponentProps<typeof NativeLabel> &
  Partial<ComponentProps<typeof WebLabel>>;
