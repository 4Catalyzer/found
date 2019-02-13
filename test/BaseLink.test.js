import { mount } from 'enzyme';
import React from 'react';

import BaseLink from '../src/BaseLink';

const CustomComponent = () => <div />;

describe('<BaseLink>', () => {
  let router;

  beforeEach(() => {
    router = {
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
  });

  describe('when clicked', () => {
    it('should call a custom click handler', () => {
      const handleClick = jest.fn();
      const link = mount(
        <BaseLink to="/" match={{}} router={router} onClick={handleClick} />,
      );

      link.find('a').simulate('click');
      expect(handleClick).toBeCalled();
    });

    it('should navigate to the destination location', () => {
      const link = mount(
        <BaseLink to="/path-to-another-page" match={{}} router={router} />,
      );

      link.find('a').simulate('click', { button: 0 });
      expect(router.push).toBeCalledWith('/path-to-another-page');
    });

    it('should not navigate if the click handler calls preventDefault', () => {
      const link = mount(
        <BaseLink
          to="/"
          match={{}}
          router={router}
          onClick={event => {
            event.preventDefault();
          }}
        />,
      );

      link.find('a').simulate('click', { button: 0 });
      expect(router.push).not.toBeCalled();
    });

    it('should not navigate on modified clicks', () => {
      const link = mount(<BaseLink to="/" match={{}} router={router} />);

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

    it('should not navigate on non-left clicks', () => {
      const link = mount(<BaseLink to="/" match={{}} router={router} />);

      link.find('a').simulate('click', { button: 2 });
      expect(router.push).not.toBeCalled();
    });

    it('should not navigate if target is defined', () => {
      const link = mount(
        <BaseLink to="/" match={{}} router={router} target="_blank" />,
      );

      link.find('a').simulate('click', { button: 0 });
      expect(router.push).not.toBeCalled();
    });
  });

  describe('active state', () => {
    it('should not call isActive when not showing active state', () => {
      mount(<BaseLink to="/" match={{}} router={router} />);

      expect(router.isActive).not.toBeCalled();
    });

    it('should set activeClassName when active', () => {
      router.isActive.mockReturnValueOnce(true);
      const link = mount(
        <BaseLink
          to="/"
          match={{}}
          router={router}
          activeClassName="active"
        />,
      );

      expect(link.find('a').prop('className')).toMatch(/active/);
    });

    it('should set activeStyle when active', () => {
      router.isActive.mockReturnValueOnce(true);
      const link = mount(
        <BaseLink
          to="/"
          match={{}}
          router={router}
          activeStyle={{ color: '#fff' }}
        />,
      );

      expect(link.find('a').prop('style').color).toBe('#fff');
    });

    it('should set activePropName when active', () => {
      router.isActive.mockReturnValueOnce(true);
      const link = mount(
        <BaseLink
          as={CustomComponent}
          to="/"
          activePropName="active"
          match={{}}
          router={router}
        />,
      );

      expect(link.find(CustomComponent).prop('active')).toBe(true);
    });

    it('should not set activePropName when not active', () => {
      router.isActive.mockReturnValueOnce(false);
      const link = mount(
        <BaseLink
          as={CustomComponent}
          to="/"
          activePropName="active"
          match={{}}
          router={router}
        />,
      );

      expect(link.find(CustomComponent).prop('active')).toBe(false);
    });
  });
});
