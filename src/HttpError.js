export default class HttpError {
  constructor(status, data) {
    this.status = status;
    this.data = data;
  }
}
