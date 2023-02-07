import * as React from 'react';

import { ComponentUsingRouter } from './ComponentUsingRouter';
import { ComponentWithRouter } from './ComponentWithRouter';

export function MainPage() {
  return (
    <div>
      MainPage!
      <ComponentWithRouter />
      <ComponentUsingRouter />
    </div>
  );
}
