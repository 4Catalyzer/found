import React from 'react';

import { type Match, type Router } from './typeUtils';

export interface RouterContextState<TContext = any> {
  match: Match<TContext> | null;
  router: Router;
}

export default React.createContext<RouterContextState>(null as any);
