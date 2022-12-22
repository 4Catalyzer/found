/* eslint-disable max-classes-per-file */
import React from 'react';

import RedirectException from './RedirectException';
import { LocationDescriptor, Match, RedirectOptions } from './typeUtils';

class Redirect implements RedirectOptions {
  path?: string;

  to: string | ((match: Match) => LocationDescriptor);

  status?: number;

  constructor({ from, to, status }: RedirectOptions) {
    this.path = from;
    this.to = to;
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

// This actually doesn't extend a React.Component, but we need consumer to think that it does
class RedirectType extends React.Component<RedirectOptions> {
  // @ts-ignore
  constructor(config: RedirectOptions);
}

export default Redirect as unknown as RedirectType;
