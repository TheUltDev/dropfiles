'use client';

import type {ComponentProps, Key, ReactNode} from 'react';

import {Children, createContext, isValidElement, useContext} from 'react';
import {Tabs as WebTabs} from '@heroui/react';
import {twMerge} from 'tailwind-merge';
import {passthroughSlot, withWebAliases} from '../../utils/web-aliases';

/** HeroUI tab BEM sets w-full; important overrides match native self-start list. */
const listContainerClassName = '!w-fit max-w-full';
const listLayoutClassName =
  '!w-fit max-w-full [&_[data-slot=tabs-tab]]:!w-fit [&_[data-slot=tabs-tab]]:flex-none';
const tabLayoutClassName = '!w-fit flex-none';

const TabsIndicatorContext =
  createContext<ComponentProps<typeof WebTabs.Indicator> | null>(null);

type TabsRootProps = ComponentProps<typeof WebTabs> & {
  value?: string;
  onValueChange?: (value: string) => void;
};

function TabsRoot({
  value,
  onValueChange,
  selectedKey,
  onSelectionChange,
  children,
  ...props
}: TabsRootProps) {
  const key = selectedKey ?? value;
  const onChange =
    onSelectionChange ??
    (onValueChange
      ? (next: Key) => {
          onValueChange(String(next));
        }
      : undefined);

  return (
    <WebTabs selectedKey={key} onSelectionChange={onChange} {...props}>
      {children}
    </WebTabs>
  );
}

type TabSlotProps = {value?: string; id?: string; children?: ReactNode};

function TabsTrigger({
  value,
  id,
  children,
  className,
  ...props
}: TabSlotProps & ComponentProps<typeof WebTabs.Tab>) {
  const indicatorProps = useContext(TabsIndicatorContext);

  return (
    <WebTabs.Tab id={id ?? value} className={twMerge(tabLayoutClassName, className)} {...props}>
      {children}
      {indicatorProps ? <WebTabs.Indicator {...indicatorProps} /> : null}
    </WebTabs.Tab>
  );
}

function TabsContent({value, id, children, ...props}: TabSlotProps & ComponentProps<typeof WebTabs.Panel>) {
  return (
    <WebTabs.Panel id={id ?? value} {...props}>
      {children}
    </WebTabs.Panel>
  );
}

function TabsIndicator(_props: ComponentProps<typeof WebTabs.Indicator>) {
  return null;
}

function TabsList({children, className, ...props}: ComponentProps<typeof WebTabs.List>) {
  let indicatorProps: ComponentProps<typeof WebTabs.Indicator> | null = null;
  const listChildren: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (isValidElement<ComponentProps<typeof WebTabs.Indicator>>(child) && child.type === TabsIndicator) {
      indicatorProps = child.props;
      return;
    }
    listChildren.push(child);
  });

  return (
    <TabsIndicatorContext.Provider value={indicatorProps}>
      <WebTabs.ListContainer className={listContainerClassName}>
        <WebTabs.List className={twMerge(listLayoutClassName, className)} {...props}>
          {listChildren}
        </WebTabs.List>
      </WebTabs.ListContainer>
    </TabsIndicatorContext.Provider>
  );
}

/** Native tab slots map to web `Tab` / `Panel`. */
export const Tabs = withWebAliases(TabsRoot, {
  List: TabsList,
  ListContainer: WebTabs.ListContainer,
  Trigger: TabsTrigger,
  Label: passthroughSlot,
  Indicator: TabsIndicator,
  Content: TabsContent,
});
