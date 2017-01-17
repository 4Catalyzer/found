import mapValues from 'lodash/mapValues';
import React from 'react';

const propTypes = {
  elements: React.PropTypes.arrayOf(
    React.PropTypes.oneOfType([
      React.PropTypes.element,
      React.PropTypes.objectOf(React.PropTypes.element),
    ]),
  ).isRequired,
};

function accumulateElement(children, element) {
  if (!element || !children) {
    return element || children;
  }

  // TODO use better way to check if react element
  const props = !React.isValidElement(children) ? children : { children };

  if (!React.isValidElement(element)) {
    return mapValues(element, value => React.cloneElement(value, props));
  }

  return React.cloneElement(element, props);
}

function Renderer({ elements }) {
  return elements.reduceRight(accumulateElement, null);
}

Renderer.propTypes = propTypes;

export default Renderer;
