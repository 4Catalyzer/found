import React from 'react';
import { Store } from 'redux';

import ElementsRenderer from './ElementsRenderer';
import { FoundState, RenderPendingArgs, RenderReadyArgs } from './generics';
import { RenderErrorArgs } from './HttpError';
import StaticContainer from './StaticContainer';

export type RenderArgs = RenderPendingArgs | RenderReadyArgs | RenderErrorArgs;

export interface CreateRenderOptions {
  renderPending?: (args: RenderPendingArgs) => React.ReactElement;
  renderReady?: (args: RenderReadyArgs) => React.ReactElement;
  renderError?: (args: RenderErrorArgs) => React.ReactNode;
}
export interface ConnectedRouterOptions extends CreateRenderOptions {
  render?: (args: RenderArgs) => React.ReactElement;
  getFound?: (store: Store) => FoundState;
}

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
