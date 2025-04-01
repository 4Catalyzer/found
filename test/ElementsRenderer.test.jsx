import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import ElementsRenderer from '../src/ElementsRenderer';

describe('<ElementsRenderer>', () => {
  it('should render null when there are no elements', () => {
    const { container } = render(<ElementsRenderer elements={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render a single element', () => {
    const { container } = render(<ElementsRenderer elements={[<div />]} />);
    expect(container.querySelector('div')).toBeTruthy();
  });

  it('should render nested elements', () => {
    const Parent = ({ children }) => <div className="parent">{children}</div>;
    const Child = () => <div className="child" />;

    const { container } = render(
      <ElementsRenderer elements={[<Parent />, <Child />]} />,
    );

    const parent = container.querySelector('.parent');
    expect(parent).toBeTruthy();

    const child = parent.querySelector('.child');
    expect(child).toBeTruthy();
  });
});
