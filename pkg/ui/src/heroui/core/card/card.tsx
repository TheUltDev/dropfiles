import type {CardProps} from './types';

import {Card as NativeCard} from 'heroui-native';
import {withWebAliases} from '../../utils/web-aliases';

/** Native uses `Body`; expose `Content` alias for shared markup with web. */
export const Card = withWebAliases(NativeCard, {
  Content: NativeCard.Body,
});

export type {CardProps} from './types';
