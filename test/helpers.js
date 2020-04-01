import { mount } from 'enzyme';
import pDefer from 'p-defer';

import createRender from '../src/createRender';
import resolver from '../src/resolver';
import { getFarceResult } from '../src/server';

export class InstrumentedResolver {
  constructor() {
    // This should be a rejected promise to prevent awaiting on done before
    // trying to resolve, but Node doesn't like naked unresolved promises.
    this.done = new Promise(() => {});
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
  const { element } = await getFarceResult({ ...options, url, render });
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
