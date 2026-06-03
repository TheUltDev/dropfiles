import type {ComponentProps, ReactNode} from 'react';
import {useMemo, useRef} from 'react';
import {View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {Slider as NativeSlider, useSlider} from 'heroui-native';
import {Label} from '../../../core/label';
import {compound} from '../../../utils/compound';
import {
  CELL_ROW_FIXED_HEIGHT_PX,
  CELL_SLIDER_FILL_CLASS,
  CELL_SLIDER_LABEL_CLASS,
  CELL_SLIDER_OUTPUT_CLASS,
  CELL_SLIDER_THUMB_CLASS_NAMES,
  CELL_SLIDER_THUMB_HIT_SLOP,
  CELL_SLIDER_TRACK_CLASS,
} from '../constants';

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

type CellSliderRootProps = Omit<ComponentProps<typeof NativeSlider>, 'orientation' | 'variant'> & {
  variant?: 'default' | 'secondary';
};

function CellSliderRoot({
  variant: _variant,
  className,
  children,
  ...rest
}: CellSliderRootProps) {
  return (
    <NativeSlider orientation="horizontal" className={className ?? 'w-full'} {...rest}>
      {children}
    </NativeSlider>
  );
}

function CellSliderLabel({children, className}: {children: ReactNode; className?: string}) {
  return (
    <View pointerEvents="none" className={className ?? CELL_SLIDER_LABEL_CLASS}>
      <Label>{children}</Label>
    </View>
  );
}

function CellSliderOutput({
  className,
  classNames,
  ...rest
}: ComponentProps<typeof NativeSlider.Output>) {
  return (
    <NativeSlider.Output
      pointerEvents="none"
      className={className ?? CELL_SLIDER_OUTPUT_CLASS}
      classNames={{
        container: 'flex-row items-center justify-end',
        ...classNames,
      }}
      textProps={{className: 'text-sm font-medium text-muted'}}
      {...rest}
    />
  );
}

const cellSliderTrackStyle = {height: CELL_ROW_FIXED_HEIGHT_PX, minHeight: CELL_ROW_FIXED_HEIGHT_PX};

function CellSliderTrack({
  className,
  children,
  style,
  ...rest
}: ComponentProps<typeof NativeSlider.Track>) {
  const {
    minValue,
    maxValue,
    step,
    orientation,
    isDisabled,
    updateValue,
    setThumbDragging,
    trackSize,
    thumbSize,
  } = useSlider();
  const trackClassName = className ?? CELL_SLIDER_TRACK_CLASS;
  const updateValueRef = useRef(updateValue);
  updateValueRef.current = updateValue;
  const setThumbDraggingRef = useRef(setThumbDragging);
  setThumbDraggingRef.current = setThumbDragging;

  const trackPanGesture = useMemo(() => {
    const effectiveTrackSize = trackSize - thumbSize;

    return Gesture.Pan()
      .runOnJS(true)
      .enabled(!isDisabled && trackSize > 0)
      .activeOffsetX([-6, 6])
      .onBegin(() => {
        setThumbDraggingRef.current(0, true);
      })
      .onUpdate((event) => {
        if (effectiveTrackSize <= 0) return;

        const pos = orientation === 'horizontal' ? event.x : event.y;
        const adjustedPos =
          orientation === 'horizontal'
            ? pos - thumbSize / 2
            : trackSize - pos - thumbSize / 2;
        const pct = clamp(adjustedPos / effectiveTrackSize, 0, 1);
        const rawValue = minValue + pct * (maxValue - minValue);
        const snapped = Math.round((rawValue - minValue) / step) * step + minValue;

        updateValueRef.current(0, clamp(snapped, minValue, maxValue));
      })
      .onFinalize(() => {
        setThumbDraggingRef.current(0, false);
      });
  }, [
    isDisabled,
    maxValue,
    minValue,
    orientation,
    step,
    thumbSize,
    trackSize,
  ]);

  return (
    <GestureDetector gesture={trackPanGesture}>
      <NativeSlider.Track
        className={trackClassName}
        style={[cellSliderTrackStyle, style]}
        {...rest}>
        {children}
      </NativeSlider.Track>
    </GestureDetector>
  );
}

function CellSliderFill(props: ComponentProps<typeof NativeSlider.Fill>) {
  return (
    <NativeSlider.Fill
      pointerEvents="none"
      className={CELL_SLIDER_FILL_CLASS}
      {...props}
    />
  );
}

function CellSliderThumb({
  hitSlop = CELL_SLIDER_THUMB_HIT_SLOP,
  ...props
}: ComponentProps<typeof NativeSlider.Thumb>) {
  return (
    <NativeSlider.Thumb
      classNames={CELL_SLIDER_THUMB_CLASS_NAMES}
      hitSlop={hitSlop}
      {...props}
    />
  );
}

export const CellSlider = compound(CellSliderRoot, {
  Track: CellSliderTrack,
  Fill: CellSliderFill,
  Thumb: CellSliderThumb,
  Label: CellSliderLabel,
  Output: CellSliderOutput,
});
