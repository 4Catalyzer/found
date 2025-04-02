import { act, render as renderReact } from '@testing-library/react';
// @ts-expect-error FIX ME
import TestRenderer from 'react-test-renderer';
import pDefer from 'p-defer';

import createRender from '../src/createRender';
import resolver from '../src/resolver';
import { getFarceResult } from '../src/server';
import delay from 'delay';

export class InstrumentedResolver {
  done: Promise<void>;

  constructor() {
    // This should be a rejected promise to prevent awaiting on done before
    // trying to resolve, but Node doesn't like naked unresolved promises.
    this.done = new Promise<void>(() => {});
  }

  async *resolveElements(match: any) {
    const deferred = pDefer<void>();
    this.done = deferred.promise;

    try {
      yield* resolver.resolveElements(match);
    } finally {
      deferred.resolve();
    }
  }
}

export async function renderFarceResult({
  url = '/',
  render = createRender({}),
  ...options
}) {
  const { element } = await getFarceResult({ ...options, url, render } as any);
  return renderReact(element);
}

export function renderWithRouter(element: any, options = {}) {
  return renderFarceResult({
    ...options,

    routeConfig: [
      {
        path: '*',
        render: () => element,
      },
    ],
  });
}

export async function getTestRenderer(
  Router: React.ComponentType<any>,
  storeRef?: React.RefObject<any>,
) {
  const resolver = new InstrumentedResolver();
  let testRenderer: any;

  await act(() => {
    testRenderer = TestRenderer.create(
      <Router resolver={resolver} ref={storeRef} />,
    );
    return delay(10);
  });

  return { resolver, testRenderer };
}
