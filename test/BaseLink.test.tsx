import { render, fireEvent } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from 'vitest';

import BaseLink from '../src/Link';
import { type Router, type Match } from '../src/typeUtils';

describe('<BaseLink>', () => {
  let router: Router;
  let match: Match;

  beforeEach(() => {
    match = {} as any;
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
      } as any,
      addNavigationListener: vi.fn(),
      replaceRouteConfig: vi.fn(),
    };
  });

  describe('when clicked', () => {
    it('should call a custom click handler', () => {
      const handleClick = vi.fn();
      const { getByRole } = render(
        <BaseLink
          to="/"
          match={match}
          router={router}
          onClick={handleClick}
        />,
      );

      fireEvent.click(getByRole('link'));
      expect(handleClick).toBeCalled();
    });

    it('should navigate to the destination location', () => {
      const { getByRole } = render(
        <BaseLink to="/path-to-another-page" match={match} router={router} />,
      );

      fireEvent.click(getByRole('link'));
      expect(router.push).toBeCalledWith('/path-to-another-page');
    });

    it('should not navigate if the click handler calls preventDefault', () => {
      const { getByRole } = render(
        <BaseLink
          to="/"
          match={match}
          router={router}
          // @ts-expect-error FIX ME
          onClick={(event) => {
            event.preventDefault();
          }}
        >
          hi
        </BaseLink>,
      );

      fireEvent.click(getByRole('link'));
      expect(router.push).not.toBeCalled();
    });

    it('should not navigate on modified clicks', () => {
      const { getByRole } = render(
        <BaseLink to="/" match={match} router={router} />,
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
        <BaseLink to="/" match={match} router={router} />,
      );

      fireEvent.click(getByRole('link'), { button: 2 });
      expect(router.push).not.toBeCalled();
    });

    it('should not navigate if target is defined and not _self', () => {
      const { getByRole } = render(
        <BaseLink to="/" match={match} router={router} target="_blank" />,
      );

      fireEvent.click(getByRole('link'));
      expect(router.push).not.toBeCalled();
    });

    it('should navigate if target is _self', () => {
      const { getByRole } = render(
        <BaseLink to="/" match={match} router={router} target="_self" />,
      );

      fireEvent.click(getByRole('link'));
      expect(router.push).toBeCalled();
    });
  });

  describe('active state', () => {
    it('should not call isActive when not showing active state', () => {
      render(<BaseLink to="/" match={match} router={router} />);
      expect(router.isActive).not.toBeCalled();
    });

    it('should set activeClassName when active', () => {
      vi.mocked(router.isActive).mockReturnValueOnce(true);
      const { getByRole } = render(
        <BaseLink
          to="/"
          match={match}
          router={router}
          activeClassName="active"
        />,
      );

      expect(getByRole('link')).toHaveClass('active');
    });

    it('should set activeStyle when active', () => {
      vi.mocked(router.isActive).mockReturnValueOnce(true);
      const { getByRole } = render(
        <BaseLink
          to="/"
          match={match}
          router={router}
          activeStyle={{ color: '#fff' }}
        />,
      );

      expect(getByRole('link')).toHaveStyle({ color: '#fff' });
    });

    it('should set activePropName when active', () => {
      vi.mocked(router.isActive).mockReturnValueOnce(true);
      const { container } = render(
        <BaseLink to="/" match={match} router={router}>
          {(_, { active }) => (
            <div data-active={active}>
              <span>Link</span>
            </div>
          )}
        </BaseLink>,
      );

      expect(container.firstChild).toHaveAttribute('data-active', 'true');
    });

    it('should not set activePropName when not active', () => {
      vi.mocked(router.isActive).mockReturnValueOnce(false);
      const { container } = render(
        <BaseLink to="/" match={match} router={router}>
          {(_, { active }) => (
            <div data-active={active}>
              <span>Link</span>
            </div>
          )}
        </BaseLink>,
      );

      expect(container.firstChild).toHaveAttribute('data-active', 'false');
    });
  });
});
