import resolver from '../src/resolver';

export class InstrumentedResolver {
  constructor() {
    // This should be a rejected promise to prevent awaiting on done before
    // trying to resolve, but Node doesn't like naked unresolved promises.
    this.done = new Promise(() => {});
  }

  // eslint-disable-next-line require-await
  async *resolveElements(match) {
    let resolveDone;
    this.done = new Promise(resolve => {
      resolveDone = resolve;
    });

    yield* resolver.resolveElements(match);
    resolveDone();
  }
}
