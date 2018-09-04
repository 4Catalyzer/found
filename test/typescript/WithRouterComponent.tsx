import { WithRouter, withRouter } from 'found';
import * as React from 'react';

export interface MyProps {
  foo?: boolean;
}

export default withRouter(
  class MyRoutedComponent extends React.Component<MyProps & WithRouter> {
    public render() {
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
