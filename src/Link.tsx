import useEventCallback from '@restart/hooks/useEventCallback';
import { forwardRef, type MouseEvent, type SyntheticEvent } from 'react';

import useRouter from './useRouter';
import { LocationDescriptor } from 'farce';
import { Match, Router } from './typeUtils';

export type LinkPropsCommon = {
  to: LocationDescriptor;

  exact?: boolean;
  target?: React.HTMLAttributeAnchorTarget;

  /* @internal */
  match?: Match;
  /* @internal */
  router?: Router;
};

export type LinkPropsNodeChild = LinkPropsCommon &
  React.ComponentPropsWithoutRef<'a'> & {
    activeClassName?: string;
    activeStyle?: Record<string, unknown>;
    children?: React.ReactNode;
  };

export interface LinkInjectedProps {
  href: string;
  onClick: (event: SyntheticEvent) => void;
  ref?: React.Ref<any> | null;
}

export type LinkPropsWithFunctionChild = LinkPropsCommon & {
  activeClassName?: never;
  activeStyle?: never;
  onClick?: (event: MouseEvent) => void;
  children: (
    props: LinkInjectedProps,
    data: { active: boolean },
  ) => React.ReactNode;
};

export type LinkProps = LinkPropsNodeChild | LinkPropsWithFunctionChild;

const Link = forwardRef<any, LinkProps>(
  (
    {
      to,
      match: propsMatch,
      router: propsRouter,
      exact = false,
      onClick,
      target,
      children,
      activeClassName,
      activeStyle,
      ...props
    }: LinkProps,
    ref,
  ) => {
    const { router, match } = useRouter() || {
      match: propsMatch,
      router: propsRouter,
    };

    const handleClick = useEventCallback((event) => {
      onClick?.(event);

      // Don't do anything if the user's onClick handler prevented default.
      // Otherwise, let the browser handle the link with the computed href if the
      // event wasn't an unmodified left click, or if the link has a target other
      // than _self.
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.altKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.button !== 0 ||
        (target && target !== '_self')
      ) {
        return;
      }

      event.preventDefault();

      // FIXME: When clicking on a link to the same location in the browser, the
      // actual becomes a replace rather than a push. We may want the same
      // handling – perhaps implemented in the Farce protocol.
      router.push(to);
    });

    const href = router.createHref(to);
    const childrenIsFunction = typeof children === 'function';

    if (childrenIsFunction || activeClassName || activeStyle) {
      const toLocation = router.createLocation(to);
      const active = router.isActive(match!, toLocation, { exact });

      if (childrenIsFunction) {
        return children({ href, onClick: handleClick }, { active });
      }

      const anchorProps = props as LinkPropsNodeChild;
      if (active) {
        if (activeClassName) {
          anchorProps.className = anchorProps.className
            ? `${anchorProps.className} ${activeClassName}`
            : activeClassName;
        }

        if (activeStyle) {
          anchorProps.style = { ...anchorProps.style, ...activeStyle };
        }
      }
    }

    return (
      <a {...props} href={href} ref={ref} onClick={handleClick}>
        {children}
      </a>
    );
  },
);

Link.displayName = 'Link';

export default Link;
