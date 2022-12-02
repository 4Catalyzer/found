/* eslint-disable react/require-render-return */
/* eslint-disable react/no-unused-class-component-methods */
import React from 'react';

import RedirectException from './RedirectException';
import {
  LocationDescriptor,
  Match,
  RedirectOptions,
  RedirectProps,
} from './typeUtils';

class Redirect extends React.Component<RedirectProps> {
  from?: string;

  to: string | ((match: Match) => LocationDescriptor);

  status?: number;

  path?: string;

  // TODO: Why is super not called here?
  // @ts-ignore
  constructor({ from, to, status }: RedirectOptions) {
    // @ts-ignore
    this.path = from;
    // @ts-ignore
    this.to = to;
    // @ts-ignore
    this.status = status;
  }

  // TODO: render function gets data? how?
  // @ts-ignore
  render({ match }: { match: Match }) {
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
  (Redirect.prototype as any).isReactComponent = {};
}

export default Redirect;
