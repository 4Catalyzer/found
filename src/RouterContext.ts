import React from 'react';

import { type Match, type Router } from './typeUtils';

export interface RouterContextValue<TMatchContext = any> {
  match: Match<TMatchContext>;
  router: Router;
}

export default React.createContext<RouterContextValue>(null as any);
