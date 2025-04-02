import Link from 'found/Link';
import { Route, Redirect, makeRouteConfig } from 'found/jsx';

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
          <LinkItem to="/bar">Bar (async)</LinkItem>
          <LinkItem to="/baz">Baz (redirects to Foo)</LinkItem>
          <LinkItem to="/qux">Qux (missing)</LinkItem>
        </ul>
      </ul>

      {children}
    </div>
  );
}

export default makeRouteConfig(
  <Route path="/" Component={App}>
    <Route Component={() => <div>Main</div>} />
    <Route path="foo" Component={() => <div>Foo</div>} />
    <Route
      path="bar"
      getComponent={() =>
        new Promise((resolve) => {
          setTimeout(resolve, 1000, ({ data }) => <div>{data}</div>);
        })
      }
      getData={() =>
        new Promise((resolve) => {
          setTimeout(resolve, 1000, 'Bar');
        })
      }
      render={({ Component, props }) =>
        Component && props ? (
          <Component {...props} />
        ) : (
          <div>
            <small>Loading&hellip;</small>
          </div>
        )
      }
    />
    <Redirect from="baz" to="/foo" />
  </Route>,
);
