import RedirectException from './RedirectException';
import { Match, RedirectOptions } from './typeUtils';

class Redirect {
  constructor({ from, to, status }: RedirectOptions) {
    // @ts-ignore
    this.path = from;
    // @ts-ignore
    this.to = to;
    // @ts-ignore
    this.status = status;
  }

  render({ match }: { match: Match }) {
    const { to, status } = this as any;
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
  (Redirect.prototype as any).isReactComponent = {};
}

export default Redirect;
