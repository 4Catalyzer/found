import React from 'react';
import elementType from 'react-prop-types/lib/elementType';

import { routerShape } from './PropTypes';

const propTypes = {
  Component: elementType.isRequired,
  to: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.object,
  ]),
  match: React.PropTypes.object.isRequired,
  activeClassName: React.PropTypes.string,
  activeStyle: React.PropTypes.object,
  activePropName: React.PropTypes.string,
  router: routerShape.isRequired,
  exact: React.PropTypes.bool.isRequired,
  target: React.PropTypes.string,
  onClick: React.PropTypes.func,
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
      ...props
    } = this.props;

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
        href={router.createHref(to)}
        onClick={this.onClick} // This overrides props.onClick.
      />
    );
  }
}

BaseLink.propTypes = propTypes;
BaseLink.defaultProps = defaultProps;

export default BaseLink;
