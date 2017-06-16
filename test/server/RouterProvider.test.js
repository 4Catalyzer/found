import React from 'react';
import { mount } from 'enzyme';

import RouterProvider from '../../src/server/RouterProvider';
import { routerShape } from '../../src/PropTypes';

const router = {
  push: jest.fn(),
  replace: jest.fn(),
  go: jest.fn(),
  createHref: jest.fn(),
  createLocation: jest.fn(),
  isActive: jest.fn(),
  matcher: {
    match: jest.fn(),
    getRoutes: jest.fn(),
    isActive: jest.fn(),
    format: jest.fn(),
  },
  addTransitionHook: jest.fn(),
};

describe('<RouterProvider>', () => {
  it('should render children', () => {
    let wrapper;

    wrapper = mount(
      <RouterProvider router={router}>
        <div />
      </RouterProvider>,
    );
    expect(wrapper.find('div')).toHaveLength(1);

    const CustomCompoment = () => <div />;
    wrapper = mount(
      <RouterProvider router={router}>
        <CustomCompoment />
      </RouterProvider>,
    );
    expect(wrapper.find(CustomCompoment)).toHaveLength(1);
  });

  it('should pass router to children cotext', () => {
    let contextRouter;

    const contextTypes = {
      router: routerShape.isRequired,
    };

    function Child(props, context) {
      contextRouter = context.router;
      return null;
    }

    Child.contextTypes = contextTypes;

    mount(
      <RouterProvider router={router}>
        <Child />
      </RouterProvider>,
    );
    expect(contextRouter).toBeDefined();
  });
});
