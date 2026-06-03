'use client';

import type {ComponentType, ComponentProps} from 'react';

import {Toast as WebToast} from '@heroui/react';

export const Toast = WebToast as ComponentType<ComponentProps<typeof WebToast>>;
