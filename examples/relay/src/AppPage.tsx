import { Link } from 'found';
import React from 'react';

function NavItem(props) {
  return (
    <Link
      {...props}
      className="text-gray-200 h-full flex px-2 justify-center items-center"
    />
  );
}

export default function App({ children }) {
  return (
    <div>
      <nav className="h-16 bg-gray-800 mb-6 flex justify-end items-center space-x-2 px-6">
        <NavItem to="/films/ZmlsbXM6MQ==" activeClassName="font-bold">
          Films
        </NavItem>
        <NavItem to="/characters/ZmlsbXM6MQ==" activeClassName="font-bold">
          Characters
        </NavItem>
        <NavItem to="/films/ZmlsbXM6MQ==" activeClassName="font-bold">
          Ships
        </NavItem>
      </nav>

      {children}
    </div>
  );
}
