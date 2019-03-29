import resolveRenderArgs from './utils/resolveRenderArgs';

export default async function getRenderArgs(router, props) {
  let elements;

  for await (elements of resolveRenderArgs(router, props)) {
    // Nothing to do here. We just need the last value from the iterable.
  }

  return elements;
}
