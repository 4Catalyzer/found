import Link from 'found/Link';
import { routerShape } from 'found/PropTypes';
import createBrowserRouter from 'found/createBrowserRouter';
import PropTypes from 'prop-types';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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

function Main({ router }) {
  const [listenerType, setListenerType] = useState('confirm');
  const [beforeUnload, setBeforeUnload] = useState(false);

  const [showCustomConfirm, setShowCustomConfirm] = useState(false);
  const resolveCustomConfirmRef = useRef();

  const navigationListeners = useMemo(
    () => ({
      confirm: () => 'Confirm',
      customConfirm: (location) => {
        // Handle the before unload case.
        if (!location) {
          return false;
        }

        setShowCustomConfirm(true);

        return new Promise((resolve) => {
          resolveCustomConfirmRef.current = (result) => {
            setShowCustomConfirm(false);
            resolveCustomConfirmRef.current = null;
            resolve(result);
          };
        });
      },
      allow: () => true,
      block: () => false,
      delayedConfirm: () =>
        // This won't prompt on before unload.
        new Promise((resolve) => {
          setTimeout(resolve, 1000, 'Confirm');
        }),
      delayedAllow: () =>
        // This won't prompt on before unload.
        new Promise((resolve) => {
          setTimeout(resolve, 1000, true);
        }),
    }),
    [],
  );

  const navigationListener = navigationListeners[listenerType];

  useEffect(
    () =>
      router.addNavigationListener(navigationListener, {
        beforeUnload,
      }),
    [router, navigationListener, beforeUnload],
  );

  const handleChangeListenerType = useCallback((event) => {
    setListenerType(event.target.value);
  }, []);

  const handleChangeBeforeUnload = useCallback((event) => {
    setBeforeUnload(event.target.checked);
  }, []);

  const handleClickYes = useCallback(() => {
    resolveCustomConfirmRef.current(true);
  }, []);

  const handleClickNo = useCallback(() => {
    resolveCustomConfirmRef.current(false);
  }, []);

  return (
    <>
      <div>
        <label htmlFor="listener-type">
          Listener type{' '}
          <select
            id="listener-type"
            value={listenerType}
            onChange={handleChangeListenerType}
          >
            <option value="confirm">Confirm</option>
            <option value="customConfirm">Custom confirm</option>
            <option value="allow">Allow</option>
            <option value="block">Block</option>
            <option value="delayedConfirm">Delayed confirm</option>
            <option value="delayedAllow">Delayed allow</option>
          </select>
        </label>
      </div>
      <div>
        <label htmlFor="before-unload">
          Before unload{' '}
          <input
            type="checkbox"
            checked={beforeUnload}
            onChange={handleChangeBeforeUnload}
          />
        </label>
      </div>
      {showCustomConfirm && (
        <div>
          Confirm{' '}
          <button type="button" onClick={handleClickYes}>
            Yes
          </button>
          <button type="button" onClick={handleClickNo}>
            No
          </button>
        </div>
      )}
    </>
  );
}

Main.propTypes = mainPropTypes;

const BrowserRouter = createBrowserRouter({
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
