import * as React from 'react';

interface Props {
  href: string;
  active?: boolean;
  onClick: (event: React.SyntheticEvent<any>) => void;
  children: React.ReactNode;
}

export function CustomLink({ href, active, onClick, children }: Props) {
  return (
    <a href={href} className={active ? 'active' : ''} onClick={onClick}>
      {children}
    </a>
  );
}
