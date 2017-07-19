import PropTypes from 'prop-types';
import React from 'react';

const propTypes = {
  elements: PropTypes.arrayOf(
    // This should be an object of this same type, but recursive checks would
    // probably be too messy.
    PropTypes.object,
    PropTypes.element,
  ).isRequired,
};

function accumulateElement(children, element) {
  if (!children) {
    return element;
  }

  if (!element) {
    return children;
  }

  if (!React.isValidElement(children)) {
    // Children come from named child routes.
    const groups = {};
    Object.entries(children).forEach(([groupName, groupElements]) => {
      groups[groupName] = groupElements.reduceRight(
        accumulateElement, null,
      );
    });

    return React.cloneElement(element, groups);
  }

  return React.cloneElement(element, { children });
}

function Renderer({ elements }) {
  return elements.reduceRight(accumulateElement, null);
}

Renderer.propTypes = propTypes;

export default Renderer;
