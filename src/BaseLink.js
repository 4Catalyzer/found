import PropTypes from 'prop-types';
import elementType from 'prop-types-extra/lib/elementType';
import React from 'react';
import warning from 'warning';

import { routerShape } from './PropTypes';

const propTypes = {
  Component: elementType.isRequired,
  to: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  match: PropTypes.object.isRequired,
  activeClassName: PropTypes.string,
  activeStyle: PropTypes.object,
  activePropName: PropTypes.string,
  router: routerShape.isRequired,
  exact: PropTypes.bool.isRequired,
  target: PropTypes.string,
  onClick: PropTypes.func,
  childProps: PropTypes.object, // In case of name conflicts here.
};

const defaultProps = {
  Component: 'a',
  exact: false,
};

class BaseLink extends React.Component {
  onClick = (event) => {
    const { onClick, target, router, to } = this.props;

    if (onClick) {
      onClick(event);
    }

    // Don't do anything if the user's onClick handler prevented default.
    // Otherwise, let the browser handle the link with the computed href if the
    // event wasn't an unmodified left click, or if the link has a target.
    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.button !== 0 ||
      target
    ) {
      return;
    }

    event.preventDefault();

    // FIXME: When clicking on a link to the same location in the browser, the
    // actual becomes a replace rather than a push. We may want the same
    // handling – perhaps implemented in the Farce protocol.
    router.push(to);
  };

  render() {
    const {
      Component,
      to,
      match,
      activeClassName,
      activeStyle,
      activePropName,
      router,
      exact,
      childProps,
      ...props
    } = this.props;

    if (__DEV__ && props.component) {
      warning(
        typeof Component === 'function',
        (
          'Link to %s with `component` prop `%s` has an element type that ' +
          'is not a component. The expected prop for the link component is ' +
          '`Component`.'
        ),
        JSON.stringify(to),
        props.component.displayName || props.component.name,
      );
    }

    if (activeClassName || activeStyle || activePropName) {
      const toLocation = router.createLocation(to);
      const active = router.isActive(match, toLocation, { exact });

      if (active) {
        if (activeClassName) {
          props.className = props.className ?
            `${props.className} ${activeClassName}` : activeClassName;
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
        {...childProps}
        href={router.createHref(to)}
        onClick={this.onClick} // This overrides props.onClick.
      />
    );
  }
}

BaseLink.propTypes = propTypes;
BaseLink.defaultProps = defaultProps;

export default BaseLink;
