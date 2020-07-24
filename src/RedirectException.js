// This isn't really an error.
export default class RedirectException {
  isFoundRedirectException = true;

  constructor(location, status = 302) {
    this.location = location;
    this.status = status;
  }
}
