// @flow
export default class HttpError {
  status: number;
  data: any;

  constructor(status: number, data: any) {
    this.status = status;
    this.data = data;
  }
}
