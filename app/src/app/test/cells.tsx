'use client';

import {useState} from 'react';
import {View} from 'react-native';
import {Button, CellDateTime, CellSelect, CellSlider, CellSwitch} from '@workspace/ui';
import {TestScaffold, DemoSection} from '@/components/test/scaffold';
import {Muted} from '@/components/base/text';
const DEVICE_OPTIONS = [
  {id: 'mobile', label: 'Mobile'},
  {id: 'tablet', label: 'Tablet'},
  {id: 'desktop', label: 'Desktop'},
] as const;

export default function CellsScreen() {
  const [device, setDevice] = useState<string>('mobile');
  const [wifiOnly, setWifiOnly] = useState(true);
  const [volume, setVolume] = useState(50);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const setSliderVolume = (next: number | number[]) => {
    setVolume(Array.isArray(next) ? (next[0] ?? 0) : next);
  };

  return (
    <TestScaffold title="Cells" subtitle="Settings-style select, switch, and slider">
      <DemoSection title="CellSelect" description="Controlled preference picker.">
        <CellSelect value={device} onChange={setDevice} aria-label="Device preview">
          <CellSelect.Trigger>
            <CellSelect.Label>Preview device</CellSelect.Label>
            <CellSelect.Value placeholder="Choose" />
            <CellSelect.Indicator />
          </CellSelect.Trigger>
          <CellSelect.Popover>
            {DEVICE_OPTIONS.map((option) => (
              <CellSelect.Item key={option.id} id={option.id} textValue={option.label} />
            ))}
          </CellSelect.Popover>
        </CellSelect>
        <Muted>{`Selected: ${device}`}</Muted>
      </DemoSection>

      <DemoSection title="CellSwitch" description="Controlled toggle in a settings cell.">
        <CellSwitch
          isSelected={wifiOnly}
          onSelectedChange={setWifiOnly}
          aria-label="Wi-Fi only uploads">
          <CellSwitch.Trigger>
            <CellSwitch.Label>Wi-Fi only uploads</CellSwitch.Label>
            <CellSwitch.Control />
          </CellSwitch.Trigger>
        </CellSwitch>
        <Muted>{wifiOnly ? 'On' : 'Off'}</Muted>
      </DemoSection>

      <DemoSection title="CellDateTime" description="Expiration date-time; Clear when set.">
        <CellDateTime
          value={expiresAt}
          onChange={setExpiresAt}
          minimumDate={new Date()}
          aria-label="Expiration">
          <CellDateTime.Trigger>
            <CellDateTime.Label>Expiration</CellDateTime.Label>
            <CellDateTime.Value placeholder="Choose expiration" />
            <CellDateTime.Indicator />
          </CellDateTime.Trigger>
          <CellDateTime.Popover>
            <CellDateTime.Wheel />
          </CellDateTime.Popover>
        </CellDateTime>
        <View className="flex-row items-center justify-between gap-3">
          <Muted className="min-w-0 flex-1">
            {expiresAt ? `ISO: ${expiresAt}` : 'No value'}
          </Muted>
          {expiresAt ? (
            <Button size="sm" variant="ghost" onPress={() => setExpiresAt(null)}>
              Clear
            </Button>
          ) : null}
        </View>
      </DemoSection>

      <DemoSection title="CellSlider" description="Controlled range in a settings cell.">
        <CellSlider
          value={volume}
          onChange={setSliderVolume}
          minValue={0}
          maxValue={100}
          step={1}
          aria-label="Volume">
          <CellSlider.Track>
            <CellSlider.Fill />
            <CellSlider.Thumb />
            <CellSlider.Label>Volume</CellSlider.Label>
            <CellSlider.Output />
          </CellSlider.Track>
        </CellSlider>
        <Muted>{`Value: ${volume}`}</Muted>
      </DemoSection>

      <DemoSection title="Settings group" description="Stacked cells like a preferences panel.">
        <View className="gap-2">
          <CellSelect
            variant="secondary"
            value={device}
            onChange={setDevice}
            aria-label="Device preview">
            <CellSelect.Trigger>
              <CellSelect.Label>Preview device</CellSelect.Label>
              <CellSelect.Value placeholder="Choose" />
              <CellSelect.Indicator />
            </CellSelect.Trigger>
            <CellSelect.Popover>
              {DEVICE_OPTIONS.map((option) => (
                <CellSelect.Item key={option.id} id={option.id} textValue={option.label} />
              ))}
            </CellSelect.Popover>
          </CellSelect>

          <CellSwitch
            variant="secondary"
            isSelected={wifiOnly}
            onSelectedChange={setWifiOnly}
            aria-label="Wi-Fi only uploads">
            <CellSwitch.Trigger>
              <CellSwitch.Label>Wi-Fi only uploads</CellSwitch.Label>
              <CellSwitch.Control />
            </CellSwitch.Trigger>
          </CellSwitch>

          <CellSlider
            variant="secondary"
            value={volume}
            onChange={setSliderVolume}
            minValue={0}
            maxValue={100}
            step={1}
            aria-label="Volume">
            <CellSlider.Track>
              <CellSlider.Fill />
              <CellSlider.Thumb />
              <CellSlider.Label>Volume</CellSlider.Label>
              <CellSlider.Output />
            </CellSlider.Track>
          </CellSlider>

          <CellDateTime
            variant="secondary"
            value={expiresAt}
            onChange={setExpiresAt}
            minimumDate={new Date()}
            aria-label="Expiration">
            <CellDateTime.Trigger>
              <CellDateTime.Label>Expiration</CellDateTime.Label>
              <CellDateTime.Value placeholder="Choose expiration" />
              <CellDateTime.Indicator />
            </CellDateTime.Trigger>
            <CellDateTime.Popover>
              <CellDateTime.Wheel />
            </CellDateTime.Popover>
          </CellDateTime>
        </View>
      </DemoSection>
    </TestScaffold>
  );
}
