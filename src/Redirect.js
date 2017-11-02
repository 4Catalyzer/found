import RedirectException from './RedirectException';

export default class Redirect {
  constructor({ from, to }) {
    this.path = from;
    this.to = to;
  }

  render({ match }) {
    const to = this.to;
    let toLocation;

    if (typeof to === 'function') {
      toLocation = to(match);
    } else {
      const { router, params } = match;
      toLocation = router.matcher.format(to, params);
    }

    throw new RedirectException(toLocation);
  }
}

if (__DEV__) {
  // Workaround to make React Proxy give me the original class, to allow
  // makeRouteConfig to get the actual class, when using JSX for routes.
  Redirect.prototype.isReactComponent = {};
}
