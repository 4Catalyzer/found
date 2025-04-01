import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from 'vitest';

import BaseLink from '../src/Link';

const CustomComponent = ({ active, ...props }) => (
  <div data-active={active} {...props} />
);

describe('<BaseLink>', () => {
  let router;

  beforeEach(() => {
    router = {
      push: vi.fn(),
      replace: vi.fn(),
      go: vi.fn(),
      createHref: vi.fn(() => '/'),
      createLocation: vi.fn(),
      isActive: vi.fn(),
      matcher: {
        match: vi.fn(),
        getRoutes: vi.fn(),
        isActive: vi.fn(),
        format: vi.fn(),
      },
      addNavigationListener: vi.fn(),
    };
  });

  describe('when clicked', () => {
    it('should call a custom click handler', () => {
      const handleClick = vi.fn();
      const { getByRole } = render(
        <BaseLink to="/" match={{}} router={router} onClick={handleClick} />,
      );

      fireEvent.click(getByRole('link'));
      expect(handleClick).toBeCalled();
    });

    it('should navigate to the destination location', () => {
      const { getByRole } = render(
        <BaseLink to="/path-to-another-page" match={{}} router={router} />,
      );

      fireEvent.click(getByRole('link'));
      expect(router.push).toBeCalledWith('/path-to-another-page');
    });

    it('should not navigate if the click handler calls preventDefault', () => {
      const { getByRole } = render(
        <BaseLink
          to="/"
          match={{}}
          router={router}
          onClick={(event) => {
            event.preventDefault();
          }}
        />,
      );

      fireEvent.click(getByRole('link'));
      expect(router.push).not.toBeCalled();
    });

    it('should not navigate on modified clicks', () => {
      const { getByRole } = render(
        <BaseLink to="/" match={{}} router={router} />,
      );

      const link = getByRole('link');

      fireEvent.click(link, { metaKey: true });
      expect(router.push).not.toBeCalled();

      fireEvent.click(link, { altKey: true });
      expect(router.push).not.toBeCalled();

      fireEvent.click(link, { ctrlKey: true });
      expect(router.push).not.toBeCalled();

      fireEvent.click(link, { shiftKey: true });
      expect(router.push).not.toBeCalled();
    });

    it('should not navigate on non-left clicks', () => {
      const { getByRole } = render(
        <BaseLink to="/" match={{}} router={router} />,
      );

      fireEvent.click(getByRole('link'), { button: 2 });
      expect(router.push).not.toBeCalled();
    });

    it('should not navigate if target is defined and not _self', () => {
      const { getByRole } = render(
        <BaseLink to="/" match={{}} router={router} target="_blank" />,
      );

      fireEvent.click(getByRole('link'));
      expect(router.push).not.toBeCalled();
    });

    it('should navigate if target is _self', () => {
      const { getByRole } = render(
        <BaseLink to="/" match={{}} router={router} target="_self" />,
      );

      fireEvent.click(getByRole('link'));
      expect(router.push).toBeCalled();
    });
  });

  describe('active state', () => {
    it('should not call isActive when not showing active state', () => {
      render(<BaseLink to="/" match={{}} router={router} />);
      expect(router.isActive).not.toBeCalled();
    });

    it('should set activeClassName when active', () => {
      router.isActive.mockReturnValueOnce(true);
      const { getByRole } = render(
        <BaseLink
          to="/"
          match={{}}
          router={router}
          activeClassName="active"
        />,
      );

      expect(getByRole('link')).toHaveClass('active');
    });

    it('should set activeStyle when active', () => {
      router.isActive.mockReturnValueOnce(true);
      const { getByRole, debug } = render(
        <BaseLink
          to="/"
          match={{}}
          router={router}
          activeStyle={{ color: '#fff' }}
        />,
      );

      console.log(debug());
      expect(getByRole('link')).toHaveStyle({ color: '#fff' });
    });

    it('should set activePropName when active', () => {
      router.isActive.mockReturnValueOnce(true);
      const { container } = render(
        <BaseLink
          as={CustomComponent}
          to="/"
          activePropName="active"
          match={{}}
          router={router}
        />,
      );

      expect(container.firstChild).toHaveAttribute('data-active', 'true');
    });

    it('should not set activePropName when not active', () => {
      router.isActive.mockReturnValueOnce(false);
      const { container } = render(
        <BaseLink
          as={CustomComponent}
          to="/"
          activePropName="active"
          match={{}}
          router={router}
        />,
      );

      expect(container.firstChild).toHaveAttribute('data-active', 'false');
    });
  });
});
