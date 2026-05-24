import {View} from 'react-native';
import {Body, Muted, Small} from '@/components/base/text';

type Props = {
  steps: string[];
  currentStep: number;
};

export function DropWizardStepper({steps, currentStep}: Props) {
  return (
    <View className="flex-row items-center gap-2">
      {steps.map((step, index) => {
        const active = index === currentStep;
        const done = index < currentStep;
        return (
          <View key={step} className="flex-1 gap-2">
            <View
              className={`h-1 rounded-full ${done || active ? 'bg-accent' : 'bg-default'}`}
            />
            <Small className={active ? 'text-foreground' : 'text-muted'}>{step}</Small>
          </View>
        );
      })}
    </View>
  );
}
