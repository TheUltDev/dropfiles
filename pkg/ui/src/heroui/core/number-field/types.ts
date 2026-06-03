import type {ComponentProps} from 'react';
import type {NumberField as WebNumberField} from '@heroui/react';
import type {NumberField as NativeNumberField} from 'heroui-native-pro/number-field';

export type NumberFieldProps = ComponentProps<typeof NativeNumberField> &
  Partial<ComponentProps<typeof WebNumberField>>;
