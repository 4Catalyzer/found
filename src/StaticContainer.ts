/* eslint-disable react/prop-types */
import React from 'react';

interface Props {
  shouldUpdate: boolean;
}

class StaticContainer extends React.Component<Props> {
  shouldComponentUpdate({ shouldUpdate }: Props) {
    return !!shouldUpdate;
  }

  render() {
    const child = this.props.children;
    if (child === null || child === false) return null;
    return React.Children.only(child);
  }
}

export default StaticContainer;
