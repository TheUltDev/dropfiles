import {useMemo, useState} from 'react';
import {Platform, Pressable, Text, View} from 'react-native';
import DateTimePicker from '@expo/ui/datetimepicker';
import {Button} from '../Button';
import {Label} from '../Label';
import {
  formatExpirationLabel,
  mergeExpirationDate,
} from '../utils/expiration';

const triggerClassName =
  'w-full rounded-xl border border-field-border bg-field-background px-3 py-3';

type PickerStep = 'closed' | 'date' | 'time' | 'datetime';

export type DateTimeFieldProps = {
  label?: string;
  value: string | null;
  onChange: (value: string | null) => void;
  minimumDate?: Date;
  isDisabled?: boolean;
  className?: string;
};

function clampToMinimum(iso: string, minimumDate?: Date): string {
  if (!minimumDate) return iso;
  const merged = new Date(iso);
  return merged < minimumDate ? minimumDate.toISOString() : iso;
}

export function DateTimeField({
  label,
  value,
  onChange,
  minimumDate,
  isDisabled,
  className,
}: DateTimeFieldProps) {
  const [pickerStep, setPickerStep] = useState<PickerStep>('closed');
  const [draftDate, setDraftDate] = useState<Date | null>(null);
  const pickerValue = useMemo(() => (value ? new Date(value) : new Date()), [value]);

  const closePicker = () => {
    setPickerStep('closed');
    setDraftDate(null);
  };

  const openPicker = () => {
    if (isDisabled) return;
    setDraftDate(pickerValue);
    setPickerStep(Platform.OS === 'android' ? 'date' : 'datetime');
  };

  if (value == null) {
    return label ? (
      <View className={className ?? 'gap-2'}>
        <Label>{label}</Label>
      </View>
    ) : null;
  }

  return (
    <View className={className ?? 'gap-2'}>
      {label ? <Label>{label}</Label> : null}
      <Pressable className={triggerClassName} disabled={isDisabled} onPress={openPicker}>
        <Text className="text-sm text-field-foreground">{formatExpirationLabel(value)}</Text>
      </Pressable>

      {Platform.OS === 'ios' && pickerStep === 'datetime' ? (
        <View className="gap-2">
          <DateTimePicker
            style={{width: '100%'}}
            value={draftDate ?? pickerValue}
            mode="datetime"
            display="spinner"
            minimumDate={minimumDate}
            disabled={isDisabled}
            onValueChange={(_event, selectedDate) => {
              setDraftDate(selectedDate);
            }}
          />
          <Button
            onPress={() => {
              if (draftDate) {
                onChange(clampToMinimum(draftDate.toISOString(), minimumDate));
              }
              closePicker();
            }}>
            Done
          </Button>
        </View>
      ) : null}

      {Platform.OS === 'android' && pickerStep === 'date' ? (
        <DateTimePicker
          style={{width: '100%'}}
          value={draftDate ?? pickerValue}
          mode="date"
          presentation="dialog"
          minimumDate={minimumDate}
          disabled={isDisabled}
          onValueChange={(_event, selectedDate) => {
            setDraftDate(selectedDate);
            setPickerStep('time');
          }}
          onDismiss={closePicker}
        />
      ) : null}

      {Platform.OS === 'android' && pickerStep === 'time' ? (
        <DateTimePicker
          style={{width: '100%'}}
          value={draftDate ?? pickerValue}
          mode="time"
          presentation="dialog"
          disabled={isDisabled}
          onValueChange={(_event, selectedTime) => {
            if (!draftDate) {
              closePicker();
              return;
            }
            const merged = mergeExpirationDate(
              draftDate,
              selectedTime.getHours(),
              selectedTime.getMinutes(),
            );
            onChange(clampToMinimum(merged, minimumDate));
            closePicker();
          }}
          onDismiss={closePicker}
        />
      ) : null}
    </View>
  );
}
