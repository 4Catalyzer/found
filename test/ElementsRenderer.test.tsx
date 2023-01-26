import { mount } from 'enzyme';
import React from 'react';

import ElementsRenderer from '../src/ElementsRenderer';

const Parent = ({ children }: { children?: React.ReactNode }) => (
  <div className="parent">{children}</div>
);
const Child = () => <div className="child" />;

describe('<ElementsRenderer>', () => {
  it('should render null when there are no elements', () => {
    const wrapper = mount(<ElementsRenderer elements={[]} />);
    expect(wrapper.html()).toBe(null);
  });

  it('should render a single element', () => {
    const wrapper = mount(<ElementsRenderer elements={[<div />]} />);
    expect(wrapper.find('div')).toHaveLength(1);
  });

  it('should render sibling elements', () => {
    const wrapper = mount(
      <ElementsRenderer elements={[<Parent />, <Parent />, <Child />]} />,
    );

    console.log(wrapper.html());
    const parent = wrapper.find(Parent);
    expect(parent).toHaveLength(2);

    const child = parent.find(Child);
    expect(child).toHaveLength(1);
  });
});
