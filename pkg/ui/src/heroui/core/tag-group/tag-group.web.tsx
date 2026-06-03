'use client';

import {Tag, TagGroup as WebTagGroup} from '@heroui/react';
import {withWebAliases} from '../../utils/web-aliases';

/** Web tags use `Tag`; native uses `TagGroup.Item`. */
export const TagGroup = withWebAliases(WebTagGroup, {
  Item: Tag,
});
