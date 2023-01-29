import {
  HttpError,
  Redirect,
  Route,
  RouteMatch,
  createBrowserRouter,
  makeRouteConfig,
} from 'found';

import { AppPage } from './AppPage';
import { MainPage } from './MainPage';
import { WidgetsPage } from './WidgetsPage';
import { createRoot } from 'react-dom/client';
import ReactDOM from 'react-dom';

const fetchWidget = (_widgetId: any) =>
  new Promise((_resolve) => {
    throw new Error('oops');
  });

const fetchWidgets = ({ params: _p, context: _c }: RouteMatch) => [
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
            import('./WidgetsPage').then((module) => module.WidgetsPage)
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
          new Promise((resolve) => {
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
// createRoot(document.getElementById('root') as HTMLElement).render(
//   <BrowserRouter />,
// );
