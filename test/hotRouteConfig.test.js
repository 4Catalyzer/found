import ServerProtocol from 'farce/lib/ServerProtocol';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';

import createFarceRouter from '../src/createFarceRouter';
import createRender from '../src/createRender';
import hotRouteConfig from '../src/hotRouteConfig';

import { InstrumentedResolver } from './helpers';

describe('hotRouteConfig', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);

    /* eslint-env browser */
    // eslint-disable-next-line no-underscore-dangle
    delete window.__FOUND_HOT_RELOAD__;
    /* eslint-env browser: false */
  });

  it('should reload the route configuration', async () => {
    const routeConfig = hotRouteConfig([
      {
        path: '/foo',
        render: () => <div className="foo" />,
      },
    ]);

    const Router = createFarceRouter({
      historyProtocol: new ServerProtocol('/foo'),
      routeConfig,

      render: createRender({}),
    });

    const resolver = new InstrumentedResolver();
    // eslint-disable-next-line react/no-render-return-value
    const instance = ReactDOM.render(
      <Router resolver={resolver} />,
      container,
    );

    await resolver.done;

    ReactTestUtils.findRenderedDOMComponentWithClass(instance, 'foo');
    expect(
      ReactTestUtils.scryRenderedDOMComponentsWithClass(instance, 'bar'),
    ).toHaveLength(0);

    hotRouteConfig([
      {
        path: '/foo',
        render: () => <div className="bar" />,
      },
    ]);

    await resolver.done;

    ReactTestUtils.findRenderedDOMComponentWithClass(instance, 'bar');
    expect(
      ReactTestUtils.scryRenderedDOMComponentsWithClass(instance, 'foo'),
    ).toHaveLength(0);
  });
});
