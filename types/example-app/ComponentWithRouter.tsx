import { WithRouterProps } from 'found';
import withRouter from 'found/lib/withRouter';
import * as React from 'react';

interface Props extends WithRouterProps {
  foo?: boolean;
}

class ComponentWithRouter extends React.Component<Props> {
  render() {
    const {
      match: { location },
      router,
    } = this.props;
    return (
      <div>
        {location.pathname}, {router}
      </div>
    );
  }
}

const ComponentWithRouterContainer = withRouter(ComponentWithRouter);
export { ComponentWithRouterContainer as ComponentWithRouter };
