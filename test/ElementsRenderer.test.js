import { mount } from 'enzyme';
import React from 'react';
import { describe, expect, it } from 'vitest';

import ElementsRenderer from '../src/ElementsRenderer';

describe('<ElementsRenderer>', () => {
  it('should render null when there are no elements', () => {
    const wrapper = mount(<ElementsRenderer elements={[]} />);
    expect(wrapper.html()).toBe(null);
  });

  it('should render a single element', () => {
    const wrapper = mount(<ElementsRenderer elements={[<div />]} />);
    expect(wrapper.find('div')).toHaveLength(1);
  });

  it('should render nested elements', () => {
    const Parent = ({ children }) => <div className="parent">{children}</div>;
    const Child = () => <div className="child" />;

    const wrapper = mount(
      <ElementsRenderer elements={[<Parent />, <Child />]} />,
    );

    const parent = wrapper.find(Parent);
    expect(parent).toHaveLength(1);

    const child = parent.find(Child);
    expect(child).toHaveLength(1);
  });
});
