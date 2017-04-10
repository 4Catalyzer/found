import PropTypes from 'prop-types';
import React from 'react';

import { routerShape } from '../PropTypes';

const propTypes = {
  router: routerShape.isRequired,
  children: PropTypes.element.isRequired,
};

const childContextTypes = {
  router: routerShape.isRequired,
};

class RouterProvider extends React.Component {
  getChildContext() {
    return {
      router: this.props.router,
    };
  }

  // This doesn't need the logic for changes to the router object; it's only
  // used for server-side rendering and should only render once.

  render() {
    return this.props.children;
  }
}

RouterProvider.propTypes = propTypes;
RouterProvider.childContextTypes = childContextTypes;

export default RouterProvider;
