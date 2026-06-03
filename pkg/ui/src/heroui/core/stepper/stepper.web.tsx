'use client';

import type {ComponentProps, ReactElement, ReactNode} from 'react';

import {Children, isValidElement} from 'react';
import {Stepper as WebStepper} from '@heroui-pro/react/stepper';
import {compound} from '../../utils/compound';

type AnyProps = Record<string, unknown> & {children?: ReactNode};

function StepperRail(_props: {children?: ReactNode}): null {
  return null;
}

function StepperIndicator(_props: ComponentProps<typeof WebStepper.Indicator>): null {
  return null;
}

function StepperIndicatorCheck(): null {
  return null;
}

function StepperIndicatorNumber(): null {
  return null;
}

function StepperSeparator(_props: ComponentProps<typeof WebStepper.Separator>): null {
  return null;
}

function StepperSeparatorTrack(): null {
  return null;
}

function StepperSeparatorFill(): null {
  return null;
}

function StepperStep(_props: ComponentProps<typeof WebStepper.Step>): null {
  return null;
}

function buildIndicator(props: AnyProps) {
  const {children, ...rest} = props;
  const kept = Children.toArray(children).filter(
    (child) =>
      !isValidElement(child) ||
      (child.type !== StepperIndicatorCheck && child.type !== StepperIndicatorNumber),
  );

  return (
    <WebStepper.Indicator {...rest}>
      {kept.length > 0 ? kept : undefined}
    </WebStepper.Indicator>
  );
}

function buildSeparator(props: AnyProps) {
  const {children: _children, ...rest} = props;
  return <WebStepper.Separator {...rest} />;
}

function extractStepParts(children: ReactNode) {
  let indicator: ReactNode | undefined;
  let content: ReactNode | null = null;
  let separator: ReactNode | undefined;
  const rest: ReactNode[] = [];

  const handle = (node: ReactNode) => {
    if (!isValidElement(node)) {
      rest.push(node);
      return;
    }

    const element = node as ReactElement<AnyProps>;

    if (element.type === StepperIndicator) {
      indicator = buildIndicator(element.props);
    } else if (element.type === WebStepper.Indicator) {
      indicator = element;
    } else if (element.type === StepperSeparator) {
      separator = buildSeparator(element.props);
    } else if (element.type === WebStepper.Separator) {
      separator = element;
    } else if (element.type === WebStepper.Content) {
      content = element;
    } else {
      rest.push(node);
    }
  };

  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === StepperRail) {
      Children.forEach((child as ReactElement<{children?: ReactNode}>).props.children, handle);
      return;
    }
    handle(child);
  });

  return {
    indicator: indicator ?? <WebStepper.Indicator />,
    content,
    separator: separator ?? <WebStepper.Separator />,
    rest,
  };
}

function adaptStep(stepElement: ReactElement<ComponentProps<typeof WebStepper.Step>>) {
  const {children, ...stepProps} = stepElement.props;
  const {indicator, content, separator, rest} = extractStepParts(children);

  return (
    <WebStepper.Step {...stepProps}>
      {indicator}
      {content}
      {rest}
      {separator}
    </WebStepper.Step>
  );
}

function StepperRoot(props: ComponentProps<typeof WebStepper>) {
  const {children, ...rest} = props;
  const webChildren = Children.map(children, (child) => {
    if (
      isValidElement<ComponentProps<typeof WebStepper.Step>>(child) &&
      child.type === StepperStep
    ) {
      return adaptStep(child);
    }
    return child;
  });

  return <WebStepper {...rest}>{webChildren}</WebStepper>;
}

export const Stepper = compound(StepperRoot, {
  Step: StepperStep,
  Rail: StepperRail,
  Indicator: StepperIndicator,
  IndicatorCheck: StepperIndicatorCheck,
  IndicatorNumber: StepperIndicatorNumber,
  Separator: StepperSeparator,
  SeparatorTrack: StepperSeparatorTrack,
  SeparatorFill: StepperSeparatorFill,
  Content: WebStepper.Content,
  Title: WebStepper.Title,
  Description: WebStepper.Description,
});
