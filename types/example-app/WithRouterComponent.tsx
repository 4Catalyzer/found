import { WithRouter, withRouter } from 'found';
import * as React from 'react';

export interface MyProps {
  foo?: boolean;
}

const WithRouterComponent = withRouter(
  class MyRoutedComponent extends React.Component<MyProps & WithRouter> {
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
  },
);

export { WithRouterComponent };
