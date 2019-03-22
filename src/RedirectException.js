// This isn't really an error.
export default class RedirectException {
  isFoundRedirectException = true;

  constructor(location) {
    this.location = location;
  }
}
