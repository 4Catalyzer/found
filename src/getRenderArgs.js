import resolveRenderArgs from './utils/resolveRenderArgs';

export default async function getRenderArgs(props) {
  let elements;

  for await (elements of resolveRenderArgs(props)) {
    // Nothing to do here. We just need the last value from the iterable.
  }

  return elements;
}
