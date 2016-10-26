import React from 'react';

import ElementsRenderer from './ElementsRenderer';

export default function createRender({ renderError }) {
  // This is not a component.
  // eslint-disable-next-line react/prop-types
  return function render({ error, elements }) {
    if (error) {
      return renderError ? renderError(error) : null;
    }

    return <ElementsRenderer elements={elements} />;
  };
}
