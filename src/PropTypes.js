import React from 'react';

export const routerShape = React.PropTypes.shape({
  push: React.PropTypes.func.isRequired,
  replace: React.PropTypes.func.isRequired,
  go: React.PropTypes.func.isRequired,

  createHref: React.PropTypes.func.isRequired,
  createLocation: React.PropTypes.func.isRequired,
  isActive: React.PropTypes.func.isRequired,

  addTransitionHook: React.PropTypes.func.isRequired,
});
