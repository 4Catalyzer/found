import Link from 'found/lib/Link';
import * as React from 'react';

import { CustomLink } from './CustomLink';

interface Props {
  children: React.ReactNode;
}

export function AppPage({ children }: Props) {
  return (
    <div>
      <ul>
        <li>
          <Link to="/" activeClassName="active" exact>
            Main
          </Link>
        </li>
        <li>
          <Link as={CustomLink} to="/widgets/foo" activePropName="active">
            Foo widget
          </Link>
        </li>
        <li>
          <Link to="/widgets/bar">
            {({ href, active, onClick }) => (
              <CustomLink href={href} active={active} onClick={onClick}>
                Bar widget
              </CustomLink>
            )}
          </Link>
        </li>
      </ul>

      {children}
    </div>
  );
}
