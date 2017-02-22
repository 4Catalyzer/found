// @flow
import { connect } from 'react-redux';

import { routerShape } from './PropTypes';

const routerContextTypes = {
  router: routerShape.isRequired,
};

export default function createWithRouter({
  getFound = ({ found }) => found,
  matchKey = 'resolvedMatch',
}: any) {
  const withMatch = connect(
    state => ({ match: getFound(state)[matchKey] }),
    null,
    (stateProps, dispatchProps, ownProps) => ({
      ...ownProps,
      ...stateProps,
      // We don't want dispatch here.
    }),
    // This needs to be pure, to avoid rerendering on changes to other matchKey
    // values in the store.
  );

  return function withRouter(Component: any) {
    const ConnectedComponent = withMatch(Component);

    // Yes, this is pretty gross. It's the simplest way to inject router as
    // a prop without adding yet another wrapper component, though.

    ConnectedComponent.contextTypes = {
      ...ConnectedComponent.contextTypes,
      ...routerContextTypes,
    };

    // Overwriting the method instead of extending the class is used to avoid
    // issues with compatibility on IE <= 10.
    const baseAddExtraProps = ConnectedComponent.prototype.addExtraProps;

    function addExtraProps(props) {
      return {
        ...baseAddExtraProps.call(this, props),

        // It's safe to read from the context because the router context
        // methods should never change. With the default implementation, they
        // in fact can't change.
        router: this.context.router,
      };
    }

    ConnectedComponent.prototype.addExtraProps = addExtraProps;

    return ConnectedComponent;
  };
}
