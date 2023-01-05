import React from 'react';

import { Match, Router } from './typeUtils';

export interface RouterContextState<TContext = any> {
  match: Match<TContext> | null;
  router: Router;
}

export default React.createContext<RouterContextState>(null as any);
