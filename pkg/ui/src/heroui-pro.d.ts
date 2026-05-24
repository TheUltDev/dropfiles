declare module '@heroui-pro/react/dist/components/number-stepper/index.js' {
  import type {ComponentType, ReactNode} from 'react';

  type NumberStepperParts = {
    Group: ComponentType<{children?: ReactNode; className?: string}>;
    DecrementButton: ComponentType<{children?: ReactNode; className?: string}>;
    Value: ComponentType<{children?: ReactNode | ((props: {value: number}) => ReactNode); className?: string}>;
    IncrementButton: ComponentType<{children?: ReactNode; className?: string}>;
  };

  export const NumberStepper: ComponentType<Record<string, unknown>> & NumberStepperParts;
}
