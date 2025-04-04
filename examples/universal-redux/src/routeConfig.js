import createRedirect from 'found/createRedirect';

import App from './App';

export default [
  {
    path: '/',
    Component: App,
    children: [
      {
        Component: () => <div>Main</div>,
      },
      {
        path: 'foo',
        Component: () => <div>Foo</div>,
      },
      {
        path: 'bar',
        getComponent: () =>
          new Promise((resolve) => {
            setTimeout(resolve, 1000, ({ data }) => <div>{data}</div>);
          }),
        getData: () =>
          new Promise((resolve) => {
            setTimeout(resolve, 1000, 'Bar');
          }),
        render: ({ Component, props }) =>
          Component && props ? (
            <Component {...props} />
          ) : (
            <div>
              <small>Loading&hellip;</small>
            </div>
          ),
      },
      createRedirect({
        from: 'baz',
        to: '/foo',
      }),
    ],
  },
];
