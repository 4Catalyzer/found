import {
  makeRouteConfig,
  Redirect,
  Route,
} from '../';


it('exports correctly', () => {
  expect(makeRouteConfig).toBeDefined();
  expect(Redirect).toBeDefined();
  expect(Route).toBeDefined();
});
