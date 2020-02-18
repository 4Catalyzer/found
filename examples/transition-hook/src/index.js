import Link from 'found/lib/Link';
import { routerShape } from 'found/lib/PropTypes';
import createBrowserRouter from 'found/lib/createBrowserRouter';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

function LinkItem(props) {
  return (
    <li>
      <Link {...props} activeStyle={{ fontWeight: 'bold' }} />
    </li>
  );
}

const appPropTypes = {
  children: PropTypes.node,
};

function App({ children }) {
  return (
    <div>
      <ul>
        <LinkItem to="/" exact>
          Main
        </LinkItem>
        <LinkItem to="/other">Other</LinkItem>
      </ul>

      {children}
    </div>
  );
}

App.propTypes = appPropTypes;

const mainPropTypes = {
  router: routerShape.isRequired,
};

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      transitionType: 'confirm',
      showCustomConfirm: false,
    };

    this.removeTransitionHook = props.router.addTransitionHook(
      this.onTransition,
    );

    this.resolveCustomConfirm = null;
  }

  componentWillUnmount() {
    this.removeTransitionHook();
  }

  onTransition = location => {
    switch (this.state.transitionType) {
      case 'confirm':
        return 'Confirm';
      case 'customConfirm':
        // Handle the before unload case.
        return location ? this.showCustomConfirm() : 'Confirm';
      case 'allow':
        return true;
      case 'block':
        return false;
      case 'delayedConfirm':
        // This won't prompt on before unload.
        return new Promise(resolve => {
          setTimeout(resolve, 1000, 'Confirm');
        });
      case 'delayedAllow':
        // This won't prompt on before unload.
        return new Promise(resolve => {
          setTimeout(resolve, 1000, true);
        });
      default:
        return null;
    }
  };

  onChangeSelect = event => {
    this.setState({ transitionType: event.target.value });
  };

  onClickYes = () => {
    this.resolveCustomConfirm(true);
  };

  onClickNo = () => {
    this.resolveCustomConfirm(false);
  };

  showCustomConfirm() {
    this.setState({ showCustomConfirm: true });

    return new Promise(resolve => {
      this.resolveCustomConfirm = result => {
        this.setState({ showCustomConfirm: false });
        this.resolveCustomConfirm = null;
        resolve(result);
      };
    });
  }

  render() {
    const { transitionType, showCustomConfirm } = this.state;

    return (
      <div>
        <label htmlFor="transition-type">
          Transition type{' '}
          <select
            id="transition-type"
            value={transitionType}
            onChange={this.onChangeSelect}
          >
            <option value="confirm">Confirm</option>
            <option value="customConfirm">Custom confirm</option>
            <option value="allow">Allow</option>
            <option value="block">Block</option>
            <option value="delayedConfirm">Delayed confirm</option>
            <option value="delayedAllow">Delayed allow</option>
          </select>
        </label>
        {showCustomConfirm && (
          <div>
            Confirm{' '}
            <button type="button" onClick={this.onClickYes}>
              Yes
            </button>
            <button type="button" onClick={this.onClickNo}>
              No
            </button>
          </div>
        )}
      </div>
    );
  }
}

Main.propTypes = mainPropTypes;

const BrowserRouter = createBrowserRouter({
  historyOptions: { useBeforeUnload: true },

  routeConfig: [
    {
      path: '/',
      Component: App,
      children: [
        {
          Component: Main,
        },
        {
          path: 'other',
          Component: () => <div>Other</div>,
        },
      ],
    },
  ],
});

ReactDOM.render(<BrowserRouter />, document.getElementById('root'));
