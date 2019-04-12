import { Match, Router } from 'found';
import withRouter from 'found/lib/withRouter';
import * as React from 'react';

interface Props {
  foo?: boolean;
  match: Match;
  router: Router;
}

function ComponentWithRouter({ match, router }: Props) {
  return (
    <div>
      {match.location.pathname}, {router}
    </div>
  );
}

const ComponentWithRouterContainer = withRouter(ComponentWithRouter);
export { ComponentWithRouterContainer as ComponentWithRouter };
