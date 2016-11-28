/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import {
  mount,
} from 'enzyme';

import BaseLink from '../src/BaseLink';

const CustomComponent = () => <div />;

let router;

beforeEach(() => {
  router = {
    push: jest.fn(),
    replace: jest.fn(),
    go: jest.fn(),
    isActive: jest.fn(),
    createHref: jest.fn(),
    createLocation: jest.fn(),
    addTransitionHook: jest.fn(),
  };
});

it('renders <a> as default', () => {
  const link = mount(
    <BaseLink
      match={{}}
      router={router}
    />
  );
  expect(link.find('a')).toHaveLength(1);
});

it('can use custom Component as link', () => {
  const link = mount(
    <BaseLink
      match={{}}
      router={router}
      Component={CustomComponent}
    />
  );
  expect(link.find('a')).toHaveLength(0);
  expect(link.find(CustomComponent)).toHaveLength(1);
});

describe('when clicked', () => {
  it('calls a user defined click handler', () => {
    const handleClick = jest.fn();
    const link = mount(
      <BaseLink
        match={{}}
        router={router}
        onClick={handleClick}
      />
    );

    link.find('a').simulate('click');
    expect(handleClick).toBeCalled();
  });

  it('push location with `to`', () => {
    const link = mount(
      <BaseLink
        to="/path-to-another-page"
        match={{}}
        router={router}
      />
    );

    link.find('a').simulate('click', { button: 0 });
    expect(router.push).toBeCalledWith('/path-to-another-page');
  });

  it('should not push location if handler call preventDefault', () => {
    const handleClick = event => event.preventDefault();
    const link = mount(
      <BaseLink
        match={{}}
        router={router}
        onClick={handleClick}
      />
    );

    link.find('a').simulate('click', { button: 0 });
    expect(router.push).not.toBeCalled();
  });

  it('should not push location if click be modified', () => {
    const link = mount(
      <BaseLink
        match={{}}
        router={router}
      />
    );
    const a = link.find('a');

    a.simulate('click', { button: 0, metaKey: true });
    expect(router.push).not.toBeCalled();

    a.simulate('click', { button: 0, altKey: true });
    expect(router.push).not.toBeCalled();

    a.simulate('click', { button: 0, ctrlKey: true });
    expect(router.push).not.toBeCalled();

    a.simulate('click', { button: 0, shiftKey: true });
    expect(router.push).not.toBeCalled();
  });

  it('should not push location if it was not a left click', () => {
    const link = mount(
      <BaseLink
        match={{}}
        router={router}
      />
    );

    link.find('a').simulate('click', { button: 2 });
    expect(router.push).not.toBeCalled();
  });

  it('should not push location if target exists', () => {
    const link = mount(
      <BaseLink
        match={{}}
        router={router}
        target="_blank"
      />
    );

    link.find('a').simulate('click', { button: 0 });
    expect(router.push).not.toBeCalled();
  });
});

describe('active state', () => {
  it('should not call isActive when all of activeClassName, activeStyle, activePropName were absence', () => { // eslint-disable-line max-len
    mount(
      <BaseLink
        match={{}}
        router={router}
      />
    );
    expect(router.isActive).not.toBeCalled();
  });

  it('passed activeClassName down when active', () => {
    router.isActive.mockReturnValueOnce(true);
    const link = mount(
      <BaseLink
        match={{}}
        router={router}
        activeClassName="active"
      />
    );

    expect(link.find('a').prop('className')).toMatch(/active/);
  });

  it('passed activeStyle down when active', () => {
    router.isActive.mockReturnValueOnce(true);
    const link = mount(
      <BaseLink
        match={{}}
        router={router}
        activeStyle={{ color: '#fff' }}
      />
    );

    expect(link.find('a').prop('style').color).toBe('#fff');
  });

  it('passed activePropName to Component when it exists', () => {
    router.isActive.mockReturnValueOnce(true);
    let link = mount(
      <BaseLink
        match={{}}
        router={router}
        Component={CustomComponent}
        activePropName="active"
      />
    );

    expect(link.find(CustomComponent).prop('active')).toBe(true);

    router.isActive.mockReturnValueOnce(false);

    link = mount(
      <BaseLink
        match={{}}
        router={router}
        Component={CustomComponent}
        activePropName="active"
      />
    );

    expect(link.find(CustomComponent).prop('active')).toBe(false);
  });
});
