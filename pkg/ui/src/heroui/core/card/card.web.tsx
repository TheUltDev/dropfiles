'use client';

import {Card as WebCard} from '@heroui/react';
import {withWebAliases} from '../../utils/web-aliases';

/** Native `Card.Body` maps to web `Card.Content`. */
export const Card = withWebAliases(WebCard, {
  Body: WebCard.Content,
});
