import React from 'react';

function accumulateElement(children, element) {
  if (!children) {
    return typeof element === 'function' ? element(null) : element;
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

export default ElementsRenderer;
