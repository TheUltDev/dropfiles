'use client';

import type {Key} from '@react-types/shared';
import type {ComponentProps, ReactNode} from 'react';

import {Accordion as WebAccordion} from '@heroui/react';
import {withWebAliases} from '../../utils/web-aliases';

type AccordionRootProps = ComponentProps<typeof WebAccordion> & {
  selectionMode?: 'single' | 'multiple';
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: ((value: string | undefined) => void) | ((value: string[]) => void);
};

function toExpandedKeys(
  input: string | string[] | Iterable<Key> | undefined,
): Set<Key> | undefined {
  if (input === undefined) {
    return undefined;
  }
  if (input instanceof Set) {
    return input;
  }
  if (typeof input === 'string') {
    return new Set([input]);
  }
  if (Array.isArray(input)) {
    return new Set(input);
  }
  return new Set(input);
}

function AccordionRoot({
  selectionMode,
  defaultValue,
  value,
  onValueChange,
  defaultExpandedKeys,
  expandedKeys,
  onExpandedChange,
  allowsMultipleExpanded,
  ...props
}: AccordionRootProps) {
  const allowsMultiple = allowsMultipleExpanded ?? selectionMode === 'multiple';

  const resolvedDefaultExpandedKeys =
    defaultExpandedKeys ??
    toExpandedKeys(
      allowsMultiple
        ? Array.isArray(defaultValue)
          ? defaultValue
          : defaultValue !== undefined
            ? [defaultValue]
            : undefined
        : Array.isArray(defaultValue)
          ? defaultValue[0]
          : defaultValue,
    );

  const resolvedExpandedKeys = expandedKeys ?? toExpandedKeys(value);

  const handleExpandedChange = (keys: Set<Key>) => {
    onExpandedChange?.(keys);
    if (!onValueChange) {
      return;
    }
    if (allowsMultiple) {
      (onValueChange as (next: string[]) => void)([...keys].map(String));
      return;
    }
    (onValueChange as (next: string | undefined) => void)(
      keys.size > 0 ? String([...keys][0]) : undefined,
    );
  };

  return (
    <WebAccordion
      allowsMultipleExpanded={allowsMultiple}
      defaultExpandedKeys={resolvedDefaultExpandedKeys}
      expandedKeys={resolvedExpandedKeys}
      onExpandedChange={handleExpandedChange}
      {...props}
    />
  );
}

type AccordionItemProps = ComponentProps<typeof WebAccordion.Item> & {
  value?: string;
};

function AccordionItem({value, id, ...props}: AccordionItemProps) {
  return <WebAccordion.Item id={id ?? value} {...props} />;
}

function AccordionTrigger(props: ComponentProps<typeof WebAccordion.Trigger>) {
  return (
    <WebAccordion.Heading>
      <WebAccordion.Trigger {...props} />
    </WebAccordion.Heading>
  );
}

type AccordionContentProps = {
  children?: ReactNode;
  className?: string;
};

function AccordionContent({children, className}: AccordionContentProps) {
  return (
    <WebAccordion.Panel>
      <WebAccordion.Body className={className}>{children}</WebAccordion.Body>
    </WebAccordion.Panel>
  );
}

/** Native accordion slots map to web disclosure structure. */
export const Accordion = withWebAliases(AccordionRoot, {
  Content: AccordionContent,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Indicator: WebAccordion.Indicator,
});
