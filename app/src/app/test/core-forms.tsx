'use client';

import {useState} from 'react';
import type {TextInputChangeEvent} from 'react-native';
import {View} from 'react-native';
import {
  Checkbox,
  FieldError,
  Label,
  RadioGroup,
  SearchField,
  Separator,
  Slider,
  TextArea,
} from '@workspace/ui';
import {TestScaffold, DemoSection} from '@/components/test/scaffold';
import {Muted} from '@/components/base/text';

function readTextChange(value: string | TextInputChangeEvent): string {
  if (typeof value === 'string') return value;
  return value.nativeEvent.text;
}

export default function CoreFormsScreen() {
  const [agreed, setAgreed] = useState(false);
  const [plan, setPlan] = useState('free');
  const [query, setQuery] = useState('');
  const [notes, setNotes] = useState('');
  const [volume, setVolume] = useState(40);

  return (
    <TestScaffold title="Core forms" subtitle="Checkbox, radio, search, slider, text area">
      <DemoSection title="Checkbox">
        <View className="flex-row items-center gap-3">
          <Checkbox isSelected={agreed} onSelectedChange={setAgreed} aria-label="Agree" />
          <Label nativeID="agree">I agree to the terms</Label>
        </View>
        <Muted>{agreed ? 'Checked' : 'Unchecked'}</Muted>
      </DemoSection>

      <DemoSection title="Radio group">
        <RadioGroup value={plan} onValueChange={setPlan}>
          <RadioGroup.Item value="free">Free</RadioGroup.Item>
          <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
        </RadioGroup>
        <Muted>{`Plan: ${plan}`}</Muted>
      </DemoSection>

      <DemoSection title="Search field">
        <SearchField
          value={query}
          onChange={(e) => setQuery(readTextChange(e))}
          aria-label="Search">
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Search files…" />
          </SearchField.Group>
        </SearchField>
      </DemoSection>

      <DemoSection title="Text area">
        <TextArea
          value={notes}
          onChange={(e) => setNotes(readTextChange(e))}
          placeholder="Notes"
          aria-label="Notes"
        />
      </DemoSection>

      <DemoSection title="Slider">
        <Slider
          value={volume}
          onChange={(v) => setVolume(Array.isArray(v) ? (v[0] ?? 0) : v)}
          aria-label="Volume">
          <Slider.Output />
          <Slider.Track>
            <Slider.Fill />
            <Slider.Thumb />
          </Slider.Track>
        </Slider>
        <Muted>{`Volume: ${volume}`}</Muted>
      </DemoSection>

      <DemoSection title="Field error">
        <FieldError>This field is required.</FieldError>
      </DemoSection>

      <DemoSection title="Separator">
        <View className="gap-3">
          <Muted>Above</Muted>
          <Separator />
          <Muted>Below</Muted>
        </View>
      </DemoSection>
    </TestScaffold>
  );
}
