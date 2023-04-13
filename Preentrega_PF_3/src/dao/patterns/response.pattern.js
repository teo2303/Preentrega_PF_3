export class ResponseData {
  constructor (status, payload) {
    this.status = status
    this.payload = payload
  }
}

export class ResponseError {
  constructor (status, payload, error) {
    this.status = status
    this.payload = payload
    this.error = error
  }
}
