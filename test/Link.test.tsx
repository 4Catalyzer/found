import { describe, expect, it } from 'vitest';

import Link from '../src/Link';
import { renderWithRouter } from './helpers';

const CustomComponent = ({
  href,
  active,
  onClick,
}: {
  href: string;
  active: boolean;
  onClick: (event: React.SyntheticEvent<any, Event>) => void;
}) => <div data-href={href} data-active={active} onClick={onClick} />;

describe('<Link>', () => {
  it('should render <a> by default', async () => {
    const { container } = await renderWithRouter(<Link to="/" />);
    expect(container.querySelector('a')).toBeTruthy();
  });

  it('should support functional children', async () => {
    const { container } = await renderWithRouter(
      <Link to="/">
        {({ href, onClick }, { active }) => (
          <CustomComponent href={href} active={active} onClick={onClick} />
        )}
      </Link>,
    );
    expect(container.querySelector('a')).toBeFalsy();

    const customNode = container.firstChild;
    expect(customNode).toHaveAttribute('data-href', '/');
    expect(customNode).toHaveAttribute('data-active', 'true');
  });

  describe('active state', () => {
    it('should set activeClassName when active', async () => {
      const { container } = await renderWithRouter(
        <Link to="/" activeClassName="active" />,
      );
      expect(container.querySelector('a')).toHaveClass('active');
    });

    it('should not set activeClassName when inactive', async () => {
      const { container } = await renderWithRouter(
        <Link to="/foo" activeClassName="active" />,
      );
      expect(container.querySelector('a')).not.toHaveClass('active');
    });

    it('should be active on child routes by default', async () => {
      const { container } = await renderWithRouter(
        <Link to="/" activeClassName="active" />,
        { url: '/foo' },
      );
      expect(container.querySelector('a')).toHaveClass('active');
    });

    it('should not be active on child routes when exact', async () => {
      const { container } = await renderWithRouter(
        <Link to="/" activeClassName="active" exact />,
        { url: '/foo' },
      );
      expect(container.querySelector('a')).not.toHaveClass('active');
    });
  });
});
