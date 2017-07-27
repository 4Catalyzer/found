import { mount } from 'enzyme';
import React from 'react';

import ElementsRenderer from '../src/ElementsRenderer';

describe('<ElementsRenderer>', () => {
  it('should render null when no item in elements', () => {
    const elements = [];
    const wrapper = mount(
      <ElementsRenderer elements={elements} />,
    );
    expect(wrapper.html()).toBe(null);
  });

  it('should render element', () => {
    const elements = [<div />];
    const wrapper = mount(
      <ElementsRenderer elements={elements} />,
    );
    expect(wrapper.find('div')).toHaveLength(1);
  });

  it('should render elements with nested structure', () => {
    const Parent = ({ children }) => <div className="parent">{children}</div>;
    const Child = () => <div className="child" />;

    const elements = [<Parent />, <Child />];

    const wrapper = mount(
      <ElementsRenderer elements={elements} />,
    );

    const parent = wrapper.find(Parent);
    expect(parent).toHaveLength(1);

    const child = parent.find(Child);
    expect(child).toHaveLength(1);
  });
});
