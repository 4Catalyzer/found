import React from 'react';

const propTypes = {
  elements: React.PropTypes.arrayOf(React.PropTypes.element).isRequired,
};

function accumulateElement(children, element) {
  if (element === undefined) {
    // No element specified for this route.
    return children;
  }

  if (element === null) {
    // Render explicit "no element" for this route.
    return null;
  }

  if (!children) {
    return element;
  }

  return React.cloneElement(element, { children });
}

function Renderer({ elements }) {
  return elements.reduceRight(accumulateElement, null);
}

Renderer.propTypes = propTypes;

export default Renderer;
