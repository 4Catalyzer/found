import resolver from '../src/resolver';

export function timeout(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export class InstrumentedResolver {
  constructor() {
    // This should be a rejected promise to prevent awaiting on done before
    // trying to resolve, but Node doesn't like naked unresolved promises.
    this.done = new Promise(() => {});
  }

  async * resolveElements(match) {
    let resolveDone;
    this.done = new Promise((resolve) => {
      resolveDone = resolve;
    });

    yield* resolver.resolveElements(match);
    resolveDone();
  }
}
