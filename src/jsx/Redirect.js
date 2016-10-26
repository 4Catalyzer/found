import invariant from 'invariant';

import RedirectObject from '../Redirect';

function createRoute(props) {
  return new RedirectObject(props);
}

function Redirect() {
  invariant(
    false,
    '<Redirect> is only for configuration and should not be rendered.',
  );
}

Redirect.createRoute = createRoute;

export default Redirect;
