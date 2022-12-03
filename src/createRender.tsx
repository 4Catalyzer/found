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
    // TODO: error and elements MIGHT exist, depending on type of renderArgs
    const { error, elements } = renderArgs as any;
    let element;

    if (error) {
      element = renderError ? renderError(renderArgs as any) : null;
    } else if (!elements) {
      element = renderPending ? renderPending(renderArgs) : undefined;
    } else if (renderReady) {
      element = renderReady(renderArgs as any);
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
