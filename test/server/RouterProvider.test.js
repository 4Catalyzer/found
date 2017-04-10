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
    let routerInContext;
    const Child = class extends React.Component { // eslint-disable-line react/prefer-stateless-function
      static contextTypes = {
        router: routerShape.isRequired,
      };

      render() {
        routerInContext = this.context.router;
        return <div />;
      }
    };

    mount(
      <RouterProvider router={router}>
        <Child />
      </RouterProvider>,
    );
    expect(routerInContext).toBeDefined();
  });
});
