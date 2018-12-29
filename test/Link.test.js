import React from 'react';

import Link from '../src/Link';
import { mountWithRouter } from './helpers';

const CustomComponent = () => <div />;

describe('<Link>', () => {
  it('should render <a> by default', async () => {
    const link = await mountWithRouter(<Link to="/" />);
    expect(link.find('a')).toHaveLength(1);
  });

  it('should support a custom component', async () => {
    const link = await mountWithRouter(
      <Link Component={CustomComponent} to="/" />,
    );
    expect(link.find('a')).toHaveLength(0);
    expect(link.find(CustomComponent)).toHaveLength(1);
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
