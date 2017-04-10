import PropTypes from 'prop-types';
import React from 'react';

const propTypes = {
  elements: PropTypes.arrayOf(
    PropTypes.element,
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
