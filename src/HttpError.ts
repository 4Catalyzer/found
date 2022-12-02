export default class HttpError {
  isFoundHttpError = true;

  status: number;

  data: any;

  constructor(status: number, data?: any) {
    this.status = status;
    this.data = data;
  }
}
