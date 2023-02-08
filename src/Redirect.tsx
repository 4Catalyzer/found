/* eslint-disable max-classes-per-file */
import React from 'react';

import RedirectException from './RedirectException';
import { LocationDescriptor, Match } from './utilityTypes';

export interface RedirectOptions {
  from?: string;
  to: string | ((match: Match) => LocationDescriptor);
  status?: number;
}

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

// It's more "natural" to call this "props" when used in the context of a
//  React component.
export type RedirectProps = RedirectOptions;
// This actually doesn't extend a React.Component, but we need consumer to think that it does
declare class RedirectType extends React.Component<RedirectProps> {
  constructor(config: RedirectOptions);
}

export default Redirect as unknown as typeof RedirectType;
