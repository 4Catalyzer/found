import React from 'react';

import HttpError from './HttpError';
import { RenderArgsElements } from './resolveRenderArgs';
import { Match, ResolvedElement } from './typeUtils';

export type RenderPendingArgs = Match;

export interface RenderReadyArgs extends Match {
  elements: RenderArgsElements;
}

export interface RenderErrorArgs extends Match {
  error: HttpError;
}

export type RenderArgs = RenderPendingArgs | RenderReadyArgs | RenderErrorArgs;

export interface ElementsRendererProps {
  elements: RenderArgsElements;
}

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
