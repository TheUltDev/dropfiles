import {View} from 'react-native';
import {Button} from '@workspace/ui';
import {TestScaffold, DemoSection} from '@/components/test/scaffold';

const VARIANTS = [
  'primary',
  'secondary',
  'tertiary',
  'outline',
  'ghost',
  'danger',
] as const;

const SIZES = ['sm', 'md', 'lg'] as const;

export default function ButtonScreen() {
  return (
    <TestScaffold title="Button" subtitle="Variants, sizes, states">
      <DemoSection title="Variants" description="Each visual style.">
        <View className="gap-3">
          {VARIANTS.map((variant) => (
            <Button key={variant} variant={variant} onPress={() => undefined}>
              {variant}
            </Button>
          ))}
        </View>
      </DemoSection>

      <DemoSection title="Sizes" description="Small, medium, large.">
        <View className="items-start gap-3">
          {SIZES.map((size) => (
            <Button key={size} size={size} onPress={() => undefined}>
              {`Size ${size}`}
            </Button>
          ))}
        </View>
      </DemoSection>

      <DemoSection title="Disabled" description="Non-interactive state.">
        <View className="gap-3">
          <Button isDisabled onPress={() => undefined}>
            Disabled primary
          </Button>
          <Button variant="secondary" isDisabled onPress={() => undefined}>
            Disabled secondary
          </Button>
        </View>
      </DemoSection>
    </TestScaffold>
  );
}
