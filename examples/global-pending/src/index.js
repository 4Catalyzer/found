import createBrowserRouter from 'found/lib/createBrowserRouter';
import ElementsRenderer from 'found/lib/ElementsRenderer';
import Link from 'found/lib/Link';
import React from 'react';
import ReactDOM from 'react-dom';
import StaticContainer from 'react-static-container';

function LinkItem(props) {
  // TODO: Remove the pragma once evcohen/eslint-plugin-jsx-a11y#81 ships.
  return (
    <li>
      <Link // eslint-disable-line jsx-a11y/anchor-has-content
        {...props}
        activeStyle={{ fontWeight: 'bold' }}
      />
    </li>
  );
}

const propTypes = {
  children: React.PropTypes.node,
};

function App({ children }) {
  return (
    <div>
      <ul>
        <LinkItem to="/">
          Main
        </LinkItem>
        <ul>
          <LinkItem to="/foo">
            Foo
          </LinkItem>
          <LinkItem to="/bar">
            Bar
          </LinkItem>
        </ul>
      </ul>

      {children}
    </div>
  );
}

App.propTypes = propTypes;

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
          getComponent: () => new Promise((resolve) => {
            setTimeout(resolve, 1000, () => <div>Foo</div>);
          }),
        },
        {
          path: 'bar',
          Component: ({ data }) => <div>{data}</div>, // eslint-disable-line react/prop-types
          getData: () => new Promise((resolve) => {
            setTimeout(resolve, 1000, 'Bar');
          }),
        },
      ],
    },
  ],

  renderPending: () => (
    <div>
      <StaticContainer>
        {null}
      </StaticContainer>

      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          background: 'white',
          opacity: 0.5,
        }}
      />
    </div>
  ),

  renderReady: ({ elements }) => ( // eslint-disable-line react/prop-types
    <div>
      <StaticContainer shouldUpdate>
        <ElementsRenderer elements={elements} />
      </StaticContainer>
    </div>
  ),
});

ReactDOM.render(
  <BrowserRouter />,
  document.getElementById('root'),
);
