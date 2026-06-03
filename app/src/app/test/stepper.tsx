import {useState} from 'react';
import {View} from 'react-native';
import {Button, Stepper} from '@workspace/ui';
import {TestScaffold, DemoSection} from '@/components/test/scaffold';
import {Muted} from '@/components/base/text';

type StepDef = {
  title: string;
  description: string;
};

const DROP_STEPS: StepDef[] = [
  {title: 'Display', description: 'How the drop looks'},
  {title: 'Access', description: 'Who can upload and when'},
  {title: 'Require', description: 'Limit file types and sizes'},
];

export default function StepperScreen() {
  return (
    <TestScaffold title="Stepper" subtitle="Progress indicator">
      <HorizontalStepperDemo />
      <VerticalStepperDemo />
      <StaticStepperDemo />
    </TestScaffold>
  );
}

function HorizontalStepperDemo() {
  const [step, setStep] = useState(0);
  const isFirst = step <= 0;
  const isLast = step >= DROP_STEPS.length - 1;

  return (
    <DemoSection
      title="Horizontal (primary)"
      description="Controlled — tap a step or use the buttons.">
      <Stepper orientation="horizontal" currentStep={step} onStepChange={setStep}>
        {DROP_STEPS.map((s) => (
          <Stepper.Step key={s.title}>
            <Stepper.Rail />
            <Stepper.Content>
              <Stepper.Title>{s.title}</Stepper.Title>
              <Stepper.Description>{s.description}</Stepper.Description>
            </Stepper.Content>
          </Stepper.Step>
        ))}
      </Stepper>

      <View className="flex-row items-center justify-between gap-3">
        <Button
          size="sm"
          variant="outline"
          isDisabled={isFirst}
          onPress={() => setStep((n) => Math.max(0, n - 1))}>
          Previous
        </Button>
        <Muted>{`Step ${step + 1} of ${DROP_STEPS.length}`}</Muted>
        <Button
          size="sm"
          isDisabled={isLast}
          onPress={() => setStep((n) => Math.min(DROP_STEPS.length - 1, n + 1))}>
          Next
        </Button>
      </View>
    </DemoSection>
  );
}

function VerticalStepperDemo() {
  const [step, setStep] = useState(1);

  return (
    <DemoSection title="Vertical (future use)" description="Same controlled API, stacked layout.">
      <Stepper orientation="vertical" currentStep={step} onStepChange={setStep}>
        {DROP_STEPS.map((s) => (
          <Stepper.Step key={s.title}>
            <Stepper.Rail />
            <Stepper.Content>
              <Stepper.Title>{s.title}</Stepper.Title>
              <Stepper.Description>{s.description}</Stepper.Description>
            </Stepper.Content>
          </Stepper.Step>
        ))}
      </Stepper>
    </DemoSection>
  );
}

function StaticStepperDemo() {
  return (
    <DemoSection
      title="Uncontrolled / default rail"
      description="Defaults to step 0, rails render automatically.">
      <Stepper orientation="horizontal" defaultStep={0}>
        {DROP_STEPS.map((s) => (
          <Stepper.Step key={s.title}>
            <Stepper.Rail />
            <Stepper.Content>
              <Stepper.Title>{s.title}</Stepper.Title>
              <Stepper.Description>{s.description}</Stepper.Description>
            </Stepper.Content>
          </Stepper.Step>
        ))}
      </Stepper>
    </DemoSection>
  );
}
