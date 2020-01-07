import PropTypes from 'prop-types';
import React from 'react';

import { routerShape } from '../PropTypes';
import RouterContext from '../RouterContext';

const propTypes = {
  renderArgs: PropTypes.shape({
    router: routerShape.isRequired,
  }).isRequired,
  children: PropTypes.node,
};

function RouterProvider({ renderArgs, children }) {
  return (
    <RouterContext.Provider
      value={{
        router: renderArgs.router,
        match: renderArgs,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
}

RouterProvider.propTypes = propTypes;

export default RouterProvider;
