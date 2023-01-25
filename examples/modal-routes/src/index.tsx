import './styles.css';
import { Link, type RouteComponentProps } from 'found';
import createBrowserRouter from 'found/createBrowserRouter';
import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Drawer } from './Drawer';

const emptyIndexRoute = { Component: () => null };

function LinkItem(props: any) {
  return (
    <li>
      <Link {...props} />
    </li>
  );
}

function App({ children }: RouteComponentProps) {
  return (
    <div className="grid grid-cols-12 h-screen">
      <ul className="col-span-3 border-r border-gray-300 p-6">
        <LinkItem to="/">Main</LinkItem>

        <LinkItem to="/customers">Customers</LinkItem>
      </ul>

      <div className="col-span-9 flex p-6">{children}</div>
    </div>
  );
}

function CustomerPage({ children, ...props }) {
  return (
    <>
      <div>
        <h1 className="text-3xl mb-4">Customers</h1>

        <ul>
          <LinkItem to="/customers/1">James Smith</LinkItem>
          <LinkItem to="/customers/2">Jane Doe</LinkItem>
          <LinkItem to="/customers/3">Yolanda Yu</LinkItem>
        </ul>
      </div>
      {children}
    </>
  );
}

function CustomerDetailDrawer({
  children,
  router,
  match,
}: RouteComponentProps) {
  return (
    <Drawer show onHide={() => router.replace(`/customers/`)}>
      <h2 className="mb-6">
        <button
          className="font-bold h-6 w-6 hover:bg-green-100 rounded-full"
          onClick={() => {
            router.go(-1);
          }}
        >
          {'<'}
        </button>{' '}
        Customer: {match.params.customerId}
      </h2>

      <p>{children}</p>
    </Drawer>
  );
}

const BrowserRouter = createBrowserRouter({
  routeConfig: [
    {
      path: '/',
      Component: App,
      children: [
        {
          Component: () => (
            <div>
              Main
              <div>
                Go to customer: <Link to="/customers/1">James Smith</Link>
              </div>
            </div>
          ),
        },
        {
          path: 'customers',
          Component: CustomerPage,
          children: [
            emptyIndexRoute,
            {
              path: ':customerId',
              Component: CustomerDetailDrawer,
              children: [
                {
                  Component: ({ match }) => (
                    <div>
                      customer details!{' '}
                      <Link
                        to={`/customers/${match.params.customerId}/settings`}
                      >
                        settings
                      </Link>
                    </div>
                  ),
                },
                {
                  path: 'settings',
                  Component: () => <div>customer settings!</div>,
                },
              ],
            },
          ],
        },
      ],
    },
  ],

  renderError: ({ error }) => (
    <div>{error.status === 404 ? 'Not found' : 'Error'}</div>
  ),
});

ReactDOM.render(
  <StrictMode>
    <BrowserRouter />
  </StrictMode>,
  document.getElementById('root'),
);
