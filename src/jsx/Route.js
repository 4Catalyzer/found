import invariant from 'invariant';

function createRoute(props) {
  return props;
}

function Route() {
  invariant(
    false,
    '<Route> is only for configuration and should not be rendered.',
  );
}

Route.createRoute = createRoute;

export default Route;
