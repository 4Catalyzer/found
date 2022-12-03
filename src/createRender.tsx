import React from 'react';

import ElementsRenderer from './ElementsRenderer';
import StaticContainer from './StaticContainer';
import { CreateRenderOptions, RenderArgs } from './typeUtils';

/**
 * A convenience method for handling the 3 main states a route match might produce.
 */
export default function createRender({
  renderPending,
  renderReady,
  renderError,
}: CreateRenderOptions): (renderArgs: RenderArgs) => React.ReactElement {
  return function render(renderArgs: RenderArgs): React.ReactElement {
    let element;

    if ('error' in renderArgs) {
      element = renderError ? renderError(renderArgs) : null;
    } else if (!('elements' in renderArgs)) {
      element = renderPending ? renderPending(renderArgs) : undefined;
    } else if (renderReady) {
      element = renderReady(renderArgs);
    } else {
      element = <ElementsRenderer elements={renderArgs.elements} />;
    }

    const hasElement = element !== undefined;

    return (
      <StaticContainer shouldUpdate={hasElement}>
        {hasElement ? element : null}
      </StaticContainer>
    );
  };
}
