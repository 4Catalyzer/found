/* eslint-disable react/prop-types */
import React from 'react';

class StaticContainer extends React.Component {
  shouldComponentUpdate({ shouldUpdate }) {
    return !!shouldUpdate;
  }

  render() {
    const child = this.props.children;
    if (child === null || child === false) return null;
    return React.Children.only(child);
  }
}

export default StaticContainer;
