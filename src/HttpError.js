export default class HttpError {
  isFoundHttpError = true;

  constructor(status, data) {
    this.status = status;
    this.data = data;
  }
}
