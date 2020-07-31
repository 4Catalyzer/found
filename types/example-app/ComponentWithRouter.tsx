import { Match, Router } from 'found';
import withRouter from 'found/withRouter';
import * as React from 'react';

interface Props {
  foo?: boolean; // eslint-disable-line react/no-unused-prop-types
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
