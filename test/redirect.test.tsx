import Redirect from '../src/Redirect';
import RedirectException from '../src/RedirectException';
import { assertRedirect } from './helpers';

describe('redirect', () => {
  it('should support static redirects', async () => {
    const testRenderer = await assertRedirect(
      new Redirect({
        from: '/foo',
        to: '/bar',
      }),
    );

    expect(testRenderer.toJSON()).toMatchInlineSnapshot(`
      <div
        className="bar"
      />
    `);
  });

  it('should support function redirects', async () => {
    const testRenderer = await assertRedirect(
      new Redirect({
        from: '/foo',
        to: ({ location }) => location.pathname.replace('foo', 'bar'),
      }),
    );

    expect(testRenderer.toJSON()).toMatchInlineSnapshot(`
      <div
        className="bar"
      />
    `);
  });

  it('should support throwing RedirectException in route render method', async () => {
    const testRenderer = await assertRedirect({
      path: '/foo',
      render: () => {
        throw new RedirectException('/bar');
      },
    });

    expect(testRenderer.toJSON()).toMatchInlineSnapshot(`
      <div
        className="bar"
      />
    `);
  });
});
