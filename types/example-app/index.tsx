import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
  createBrowserRouter,
  RouteMatch,
  HttpError,
  makeRouteConfig,
  Redirect,
  Route,
} from 'found';

import { AppPage } from './AppPage';
import { MainPage } from './MainPage';
import { WidgetsPage } from './WidgetsPage';

const fetchWidget = (widgetId: any) =>
  new Promise(resolve => {
    throw new Error('oops');
  });

const fetchWidgets = ({ params, context }: RouteMatch) => [
  'foo',
  'bar',
  'baz',
];

const BrowserRouter = createBrowserRouter({
  routeConfig: makeRouteConfig(
    <Route path="/" Component={AppPage}>
      <Route Component={MainPage} />
      <Route path="widgets">
        <Route Component={WidgetsPage} getData={fetchWidgets} />
        <Route
          path="widgets/:widgetId"
          getComponent={() =>
            import('./WidgetsPage').then(module => module.WidgetsPage)
          }
          getData={({ params: { widgetId } }) =>
            fetchWidget(widgetId).catch(() => {
              throw new HttpError(404);
            })
          }
          render={({ Component, props }) =>
            Component && props ? (
              <Component {...props} />
            ) : (
              <div>
                <small>Loading</small>
              </div>
            )
          }
        />
      </Route>
      <Route
        path="bar"
        getData={() =>
          new Promise(resolve => {
            setTimeout(resolve, 1000, 'Bar');
          })
        }
      />
      <Redirect from="widget/:widgetId" to="/widgets/:widgetId" />
    </Route>,
  ),

  renderError: ({ error }) => (
    <div>{error.status === 404 ? 'Not found' : 'Error'}</div>
  ),
});

ReactDOM.render(<BrowserRouter />, document.getElementById('root'));
