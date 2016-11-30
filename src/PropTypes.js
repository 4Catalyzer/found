import React from 'react';

// The shape might be different with a custom matcher or history enhancer, but
// the default matcher assumes and provides this shape. As such, this validator
// is purely for user convenience and should not be used internally.
export const matchShape = React.PropTypes.shape({
  location: React.PropTypes.shape({
    pathname: React.PropTypes.string.isRequired,
    query: React.PropTypes.object.isRequired,
  }).isRequired,
  params: React.PropTypes.object.isRequired,
});

// User code generally shouldn't need this, but it doesn't hurt to export here,
// since we use it for routerShape below.
export const matcherShape = React.PropTypes.shape({
  match: React.PropTypes.func.isRequired,
  getRoutes: React.PropTypes.func.isRequired,
  isActive: React.PropTypes.func.isRequired,
  format: React.PropTypes.func.isRequired,
});

export const routerShape = React.PropTypes.shape({
  push: React.PropTypes.func.isRequired,
  replace: React.PropTypes.func.isRequired,
  go: React.PropTypes.func.isRequired,

  createHref: React.PropTypes.func.isRequired,
  createLocation: React.PropTypes.func.isRequired,
  isActive: React.PropTypes.func.isRequired,
  matcher: matcherShape.isRequired,

  addTransitionHook: React.PropTypes.func.isRequired,
});
