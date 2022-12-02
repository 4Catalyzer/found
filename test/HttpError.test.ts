import HttpError from '../src/HttpError';

describe('HttpError', () => {
  it('should provide accessible status', () => {
    const error = new HttpError(404);
    expect(error.status).toBe(404);
  });
});
