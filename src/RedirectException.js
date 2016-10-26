// This isn't really an error.
export default class RedirectException {
  constructor(location) {
    this.location = location;
  }
}
