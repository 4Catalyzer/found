import createStoreRouterObject from './createStoreRouterObject';

const IS_PATCHED = Symbol('found.is_patched');
const ROUTER = Symbol('found.router');

// FIXME: This is a terrible hack. Find a better way to do this.
export default function injectRouterProp(ConnectedComponent) {
  const baseRender = ConnectedComponent.prototype.render;

  function wrapSelectDerivedProps(baseSelectDerivedProps) {
    return function selectDerivedProps(state, props, store) {
      const derivedProps = baseSelectDerivedProps(state, props, store);

      if (!store[ROUTER]) {
        // Memoize the store router object.
        // eslint-disable-next-line no-param-reassign
        store[ROUTER] = createStoreRouterObject(store);
      }

      // Intentionally preserve the same derived props object, as the identity
      // of the router object should not change unless the store changes.
      derivedProps.router = store[ROUTER];

      return derivedProps;
    };
  }

  function render() {
    if (!this[IS_PATCHED]) {
      this.selectDerivedProps = wrapSelectDerivedProps(
        this.selectDerivedProps,
      );
      this[IS_PATCHED] = true;
    }

    return baseRender.call(this);
  }

  // eslint-disable-next-line no-param-reassign
  ConnectedComponent.prototype.render = render;

  return ConnectedComponent;
}
