import { Match, Router } from 'found';
import withRouter from 'found/withRouter';
import * as React from 'react';

interface Props {
  foo?: boolean;
  match: Match;
  router: Router;
}

function ComponentWithRouter({ match, router }: Props) {
  console.log(router);
  return <div>Pathname: {match.location.pathname}</div>;
}

const ComponentWithRouterContainer = withRouter(ComponentWithRouter);
export { ComponentWithRouterContainer as ComponentWithRouter };
