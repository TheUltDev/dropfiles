import type {ComponentProps} from 'react';
import type {ListBox as WebListBox} from '@heroui/react';

/** Web ListBox; native apps should use `Select` or `Menu` instead. */
export type ListBoxProps = ComponentProps<typeof WebListBox>;
