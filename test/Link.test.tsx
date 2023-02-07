import React from 'react';

import Link from '../src/Link';
import { mountWithRouter } from './helpers';

const CustomComponent = (props: any) => <div {...props} />;

describe('<Link>', () => {
  it('should render <a> by default', async () => {
    const link = await mountWithRouter(<Link to="/" />);
    expect(link.find('a')).toHaveLength(1);
  });

  it('should support a custom component', async () => {
    const link = await mountWithRouter(
      <Link
        as={CustomComponent}
        to="/"
        activePropName="active"
        otherProp="foo"
      />,
    );
    expect(link.find('a')).toHaveLength(0);

    const customNode = link.find(CustomComponent);
    expect(customNode).toHaveLength(1);
    expect(customNode.props()).toEqual({
      href: '/',
      active: true,
      onClick: expect.any(Function),
      otherProp: 'foo',
    });
  });

  it('should support functional children', async () => {
    const link = await mountWithRouter(
      <Link to="/">
        {({ href, active, onClick }) => (
          <CustomComponent href={href} active={active} onClick={onClick} />
        )}
      </Link>,
    );
    expect(link.find('a')).toHaveLength(0);

    const customNode = link.find(CustomComponent);
    expect(customNode).toHaveLength(1);
    expect(customNode.props()).toEqual({
      href: '/',
      active: true,
      onClick: expect.any(Function),
    });
  });

  describe('active state', () => {
    it('should set activeClassName when active', async () => {
      const link = await mountWithRouter(
        <Link to="/" activeClassName="active" />,
      );
      expect(link.find('a').hasClass('active')).toBe(true);
    });

    it('should not set activeClassName when inactive', async () => {
      const link = await mountWithRouter(
        <Link to="/foo" activeClassName="active" />,
      );
      expect(link.find('a').hasClass('active')).toBe(false);
    });

    it('should be active on child routes by default', async () => {
      const link = await mountWithRouter(
        <Link to="/" activeClassName="active" />,
        { url: '/foo' },
      );
      expect(link.find('a').hasClass('active')).toBe(true);
    });

    it('should not be active on child routes when exact', async () => {
      const link = await mountWithRouter(
        <Link to="/" activeClassName="active" exact />,
        { url: '/foo' },
      );
      expect(link.find('a').hasClass('active')).toBe(false);
    });
  });
});
