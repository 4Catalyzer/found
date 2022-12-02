import { LocationDescriptor } from 'farce';

// This isn't really an error.
export default class RedirectException {
  isFoundRedirectException = true;

  location: LocationDescriptor;

  status: number;

  constructor(location: LocationDescriptor, status = 302) {
    this.location = location;
    this.status = status;
  }
}
