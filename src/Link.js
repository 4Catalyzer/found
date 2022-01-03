import useEventCallback from '@restart/hooks/useEventCallback';
import React from 'react';
import warning from 'tiny-warning';

import useRouter from './useRouter';

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
  ...props
}) {
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

  if (__DEV__ && typeof Component !== 'function') {
    for (const wrongPropName of ['component', 'Component']) {
      const wrongPropValue = props[wrongPropName];
      if (!wrongPropValue) {
        continue;
      }

      warning(
        false,
        'Link to %s with `%s` prop `%s` has an element type that is not a component. The expected prop for the link component is `as`.',
        JSON.stringify(to),
        wrongPropName,
        wrongPropValue.displayName || wrongPropValue.name || 'UNKNOWN',
      );
    }
  }

  const href = router.createHref(to);
  const childrenIsFunction = typeof props.children === 'function';

  if (childrenIsFunction || activeClassName || activeStyle || activePropName) {
    const toLocation = router.createLocation(to);
    const active = router.isActive(match, toLocation, { exact });

    if (childrenIsFunction) {
      return props.children({ href, active, onClick: handleClick });
    }

    if (active) {
      if (activeClassName) {
        props.className = props.className
          ? `${props.className} ${activeClassName}`
          : activeClassName;
      }

      if (activeStyle) {
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

export default Link;
