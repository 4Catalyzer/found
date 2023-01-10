import PropTypes from 'prop-types';

// The shape might be different with a custom matcher or history enhancer, but
// the default matcher assumes and provides this shape. As such, this validator
// is purely for user convenience and should not be used internally.
export const matchShape = PropTypes.shape({
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    query: PropTypes.object.isRequired,
  }).isRequired,
  params: PropTypes.object.isRequired,
});

// User code generally shouldn't need this, but it doesn't hurt to export here,
// since we use it for routerShape below.
export const matcherShape = PropTypes.shape({
  match: PropTypes.func.isRequired,
  getRoutes: PropTypes.func.isRequired,
  isActive: PropTypes.func.isRequired,
  format: PropTypes.func.isRequired,
});

export const routerShape = PropTypes.shape({
  push: PropTypes.func.isRequired,
  replace: PropTypes.func.isRequired,
  go: PropTypes.func.isRequired,

  createHref: PropTypes.func.isRequired,
  createLocation: PropTypes.func.isRequired,
  isActive: PropTypes.func.isRequired,
  matcher: matcherShape.isRequired,

  addNavigationListener: PropTypes.func.isRequired,
});
