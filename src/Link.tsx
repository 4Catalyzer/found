import useEventCallback from '@restart/hooks/useEventCallback';
import React from 'react';
import warning from 'tiny-warning';

import { LinkInjectedProps, LinkProps } from './typeUtils';
import useRouter from './useRouter';

// TODO: move this to utils
// Workaround for TS bug where function is not callable https://github.com/microsoft/TypeScript/issues/37663
type Fn = (...args: unknown[]) => unknown;
function isFunction<T extends Fn>(value: unknown): value is T {
  return typeof value === 'function';
}

// TODO: Try to simplify those types in next breaking change.
function Link({
  as: Component = 'a',
  to,
  activeClassName,
  activeStyle,
  activePropName,
  match: propsMatch,
  router: propsRouter,
  exact = false,
  onClick,
  target,
  children,
  ...props
}: any) {
  const { router, match } = useRouter() || {
    match: propsMatch,
    router: propsRouter,
  };

  const handleClick = useEventCallback((event) => {
    if (onClick) {
      onClick(event);
    }

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

  if (__DEV__ && !isFunction(Component)) {
    for (const wrongPropName of ['component', 'Component'] as const) {
      const wrongPropValue = (props as any)[wrongPropName];
      if (!wrongPropValue) {
        continue;
      }

      warning(
        false,
        `Link to ${JSON.stringify(to)} with \`${wrongPropName}\` prop \`${
          wrongPropValue.displayName || wrongPropValue.name || 'UNKNOWN'
        }\` has an element type that is not a component. The expected prop for the link component is \`as\`.`,
      );
    }
  }

  const href = router.createHref(to);
  const childrenIsFunction = isFunction(children);

  if (childrenIsFunction || activeClassName || activeStyle || activePropName) {
    const toLocation = router.createLocation(to);
    const active = router.isActive(match, toLocation, { exact });

    if (childrenIsFunction) {
      const add = { href, active, onClick: handleClick };
      return children(add);
    }

    if (active) {
      if (activeClassName) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        props.className = props.className
          ? `${props} ${activeClassName}`
          : activeClassName;
      }

      if (activeStyle) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        props.style = { ...props.style, ...activeStyle };
      }
    }

    if (activePropName) {
      props[activePropName] = active;
    }
  }

  return (
    <Component
      {...props}
      href={href}
      onClick={handleClick} // This overrides props.onClick.
    />
  );
}

// eslint-disable-next-line react/prefer-stateless-function
declare class LinkType<
  TInner extends React.ElementType = never,
  TInnerWithActivePropName extends React.ComponentType<
    LinkInjectedProps & { [activePropName in TActivePropName]: boolean }
  > = never,
  TActivePropName extends string = never,
> extends React.Component<
  LinkProps<TInner, TInnerWithActivePropName, TActivePropName>
> {
  // eslint-disable-next-line react/static-property-placement, react/no-unused-class-component-methods
  props: LinkProps<TInner, TInnerWithActivePropName, TActivePropName>;
}

export default Link as unknown as LinkType;
