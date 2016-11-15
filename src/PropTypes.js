import React from 'react';

// The shape might be different with a custom matcher or history enhancer, but
// the default matcher assumes and provides this shape.
export const matchShape = React.PropTypes.shape({
  location: React.PropTypes.shape({
    pathname: React.PropTypes.string.isRequired,
    query: React.PropTypes.object.isRequired,
  }).isRequired,
  params: React.PropTypes.object.isRequired,
});

export const routerShape = React.PropTypes.shape({
  push: React.PropTypes.func.isRequired,
  replace: React.PropTypes.func.isRequired,
  go: React.PropTypes.func.isRequired,

  createHref: React.PropTypes.func.isRequired,
  createLocation: React.PropTypes.func.isRequired,
  isActive: React.PropTypes.func.isRequired,

  addTransitionHook: React.PropTypes.func.isRequired,
});
