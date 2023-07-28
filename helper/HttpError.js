class HttpError extends Error {
  constructor(errorMsg, errorCode) {
    super(errorMsg);
    this.code = errorCode;
  }
}
module.exports = HttpError;
