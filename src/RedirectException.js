// @flow
// This isn't really an error.
export default class RedirectException {
  location: any;

  constructor(location: any) {
    this.location = location;
  }
}
