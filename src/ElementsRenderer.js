import PropTypes from 'prop-types';
import React from 'react';

const propTypes = {
  elements: PropTypes.arrayOf(
    PropTypes.oneOfType([
      // This should be an object of this same type, but recursive checks would
      // probably be too messy.
      PropTypes.object,
      PropTypes.element,
      PropTypes.func,
    ]),
  ).isRequired,
};

function accumulateElement(children, element) {
  if (!children) {
    return typeof element === 'function' ? element() : element;
  }

  if (!element) {
    return children;
  }

  if (!React.isValidElement(children)) {
    // Children come from named child routes.
    const groups = {};
    Object.entries(children).forEach(([groupName, groupElements]) => {
      groups[groupName] = groupElements.reduceRight(accumulateElement, null);
    });

    return typeof element === 'function'
      ? element(groups)
      : React.cloneElement(element, groups);
  }

  return typeof element === 'function'
    ? element(children)
    : React.cloneElement(element, { children });
}

function ElementsRenderer({ elements }) {
  return elements.reduceRight(accumulateElement, null);
}

ElementsRenderer.propTypes = propTypes;

export default ElementsRenderer;
