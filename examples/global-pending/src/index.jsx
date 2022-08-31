import ElementsRenderer from 'found/ElementsRenderer';
import Link from 'found/Link';
import StaticContainer from 'found/StaticContainer';
import createBrowserRouter from 'found/createBrowserRouter';
import React from 'react';
import { createRoot } from 'react-dom/client';

function LinkItem(props) {
  return (
    <li>
      <Link {...props} activeStyle={{ fontWeight: 'bold' }} />
    </li>
  );
}

function App({ children }) {
  return (
    <div>
      <ul>
        <LinkItem to="/">Main</LinkItem>
        <ul>
          <LinkItem to="/foo">Foo</LinkItem>
          <LinkItem to="/bar">Bar</LinkItem>
        </ul>
      </ul>

      {children}
    </div>
  );
}

const BrowserRouter = createBrowserRouter({
  routeConfig: [
    {
      path: '/',
      Component: App,
      children: [
        {
          Component: () => <div>Main</div>,
        },
        {
          path: 'foo',
          getComponent: () =>
            new Promise((resolve) => {
              setTimeout(resolve, 1000, () => <div>Foo</div>);
            }),
        },
        {
          path: 'bar',
          Component: ({ data }) => <div>{data}</div>,
          getData: () =>
            new Promise((resolve) => {
              setTimeout(resolve, 1000, 'Bar');
            }),
        },
      ],
    },
  ],

  renderPending: () => (
    <div>
      <StaticContainer>{null}</StaticContainer>

      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background: 'black',
          opacity: 0.5,
        }}
      />
    </div>
  ),

  renderReady: ({ elements }) => (
    <div>
      <ElementsRenderer elements={elements} />
    </div>
  ),
});

const root = createRoot(document.getElementById('root'));
root.render(<BrowserRouter />);
