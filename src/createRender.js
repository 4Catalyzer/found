import React from 'react';

import ElementsRenderer from './ElementsRenderer';
import StaticContainer from './StaticContainer';

// These are intentionally not renderLoading, renderFetched, and renderFailure
// from Relay, because these don't quite correspond to those conditions.
export default function createRender({
  renderPending,
  renderReady,
  renderError,
}) {
  return function render(renderArgs) {
    const { error, elements } = renderArgs;
    let element;

    if (error) {
      element = renderError ? renderError(renderArgs) : null;
    } else if (!elements) {
      element = renderPending ? renderPending(renderArgs) : undefined;
    } else if (renderReady) {
      element = renderReady(renderArgs);
    } else {
      element = <ElementsRenderer elements={elements} />;
    }

    const hasElement = element !== undefined;

    return (
      <StaticContainer shouldUpdate={hasElement}>
        {hasElement ? element : null}
      </StaticContainer>
    );
  };
}
