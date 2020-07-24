import RedirectException from './RedirectException';

export default class Redirect {
  constructor({ from, to, status }) {
    this.path = from;
    this.to = to;
    this.status = status;
  }

  render({ match }) {
    const { to, status } = this;
    let toLocation;

    if (typeof to === 'function') {
      toLocation = to(match);
    } else {
      const { router, params } = match;
      toLocation = router.matcher.format(to, params);
    }

    throw new RedirectException(toLocation, status);
  }
}

if (__DEV__) {
  // Workaround to make React Proxy give me the original class, to allow
  // makeRouteConfig to get the actual class, when using JSX for routes.
  Redirect.prototype.isReactComponent = {};
}
