'use client';

import {ListBox as WebListBox} from '@heroui/react';
import {webCompound} from '../../utils/native-compound';

export const ListBox = webCompound(WebListBox, [
  'Item',
  'Section',
  'ItemIndicator',
]);
