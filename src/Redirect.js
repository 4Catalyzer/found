// @flow
import RedirectException from './RedirectException';

export default class Redirect {
  path: string;
  to: string;

  constructor({ from, to }: { from: string, to: string }) {
    this.path = from;
    this.to = to;
  }

  render({ match }: { match: any }) {
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
