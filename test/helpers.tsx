import delay from 'delay';
import { mount } from 'enzyme';
import MemoryProtocol from 'farce/MemoryProtocol';
import pDefer from 'p-defer';
import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';

import createFarceRouter from '../src/createFarceRouter';
import createRender from '../src/createRender';
import resolver from '../src/resolver';
import { getFarceResult } from '../src/server';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};

export class InstrumentedResolver {
  done: Promise<unknown>;

  constructor() {
    // This should be a rejected promise to prevent awaiting on done before
    // trying to resolve, but Node doesn't like naked unresolved promises.
    this.done = new Promise(noop);
  }

  // eslint-disable-next-line require-await
  async *resolveElements(match) {
    const deferred = pDefer();
    this.done = deferred.promise;

    try {
      yield* resolver.resolveElements(match);
    } finally {
      deferred.resolve();
    }
  }
}

export async function mountFarceResult({
  url = '/',
  render = createRender({}),
  ...options
}) {
  const { element } = await getFarceResult({ ...options, url, render } as any);
  return mount(element);
}

export function mountWithRouter(element, options = {}) {
  return mountFarceResult({
    ...options,

    routeConfig: [
      {
        path: '*',
        render: () => element,
      },
    ],
  });
}

export async function assertRedirect(fooRoute) {
  const Router = createFarceRouter({
    historyProtocol: new MemoryProtocol('/foo'),
    routeConfig: [
      fooRoute,
      {
        path: '/bar',
        render: () => <div className="bar" />,
      },
    ],
  });

  const localResolver = new InstrumentedResolver();
  const testRenderer = TestRenderer.create(
    <Router resolver={localResolver} />,
  );

  await localResolver.done;

  // Let the redirect actually run.
  await act(async () => {
    await delay(10);
  });

  return testRenderer;
}
