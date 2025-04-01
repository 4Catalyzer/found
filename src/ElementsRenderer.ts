import React from 'react';

import { type ElementsRendererProps, type ResolvedElement } from './typeUtils';

function accumulateElement(
  children: ResolvedElement,
  element: ResolvedElement,
) {
  if (!children) {
    return typeof element === 'function' ? element(null as any) : element;
  }

  if (!element) {
    return children;
  }

  if (!React.isValidElement(children)) {
    // Children come from named child routes.
    const groups = {} as any;
    Object.entries(children).forEach(([groupName, groupElements]) => {
      groups[groupName] = groupElements.reduceRight(accumulateElement, null);
    });

    return typeof element === 'function'
      ? element(groups)
      : React.cloneElement(element, groups);
  }

  return typeof element === 'function'
    ? element(children as any)
    : React.cloneElement(element, { children });
}

function ElementsRenderer({ elements }: ElementsRendererProps) {
  return elements.reduceRight(
    accumulateElement,
    null,
  ) as React.ReactElement<ElementsRendererProps> | null;
}

export default ElementsRenderer;
