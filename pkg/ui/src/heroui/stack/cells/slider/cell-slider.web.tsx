'use client';

import {CellSlider as ProCellSlider} from '@heroui-pro/react/cell-slider';
import {compound} from '../../../utils/compound';

export const CellSlider = compound(ProCellSlider, {
  Track: ProCellSlider.Track,
  Fill: ProCellSlider.Fill,
  Thumb: ProCellSlider.Thumb,
  Label: ProCellSlider.Label,
  Output: ProCellSlider.Output,
});
