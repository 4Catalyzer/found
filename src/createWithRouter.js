import { connect } from 'react-redux';

import { routerShape } from './PropTypes';

const routerContextTypes = {
  router: routerShape.isRequired,
};

export default function createWithRouter({
  getMatch = ({ match }) => match,
}) {
  const withMatch = connect(
    state => ({ match: getMatch(state) }),
    null,
    (stateProps, dispatchProps, ownProps) => ({
      ...ownProps,
      ...stateProps,
      // We don't want dispatch here.
    }),
    {
      // We can't assume the wrapped component is pure.
      pure: false,
    },
  );

  return function withRouter(Component) {
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
