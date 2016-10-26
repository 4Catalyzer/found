import React from 'react';

const propTypes = {
  elements: React.PropTypes.arrayOf(
    React.PropTypes.element,
  ).isRequired,
};

function accumulateElement(children, element) {
  if (!element || !children) {
    return element || children;
  }

  return React.cloneElement(element, { children });
}

function Renderer({ elements }) {
  return elements.reduceRight(accumulateElement, null);
}

Renderer.propTypes = propTypes;

export default Renderer;
