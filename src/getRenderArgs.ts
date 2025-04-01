import resolveRenderArgs, { type ResolveRender } from './resolveRenderArgs';
import { type Router } from './typeUtils';

export default async function getRenderArgs(
  router: Router,
  props: any,
): Promise<ResolveRender> {
  let elements;

  for await (elements of resolveRenderArgs(router, props)) {
    // Nothing to do here. We just need the last value from the iterable.
  }

  return elements as ResolveRender;
}
