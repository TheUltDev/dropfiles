'use client';

import {Dropdown as WebDropdown} from '@heroui/react';
import {compound} from '../../utils/compound';

/** Web submenu maps to `Dropdown.SubmenuTrigger` (nest inside Dropdown.Menu). */
export const SubMenu = compound(WebDropdown.SubmenuTrigger, {
  TriggerIndicator: WebDropdown.SubmenuIndicator,
});
