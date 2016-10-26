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
      const { matcher, params } = match;
      toLocation = matcher.format(to, params);
    }

    throw new RedirectException(toLocation);
  }
}
