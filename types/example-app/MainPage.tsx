import * as React from 'react';

import { ComponentUsingRouter } from './ComponentUsingRouter';
import { ComponentWithRouter } from './ComponentWithRouter';

export function MainPage() {
  return (
    <div>
      <ComponentWithRouter />
      <ComponentUsingRouter />
    </div>
  );
}
