import React from 'react';

import { Match, Router } from './typeUtils';

export interface IRouterContext<TContext = any> {
  match: Match<TContext> | null;
  router: Router;
}

export default React.createContext<IRouterContext>(null as any);
