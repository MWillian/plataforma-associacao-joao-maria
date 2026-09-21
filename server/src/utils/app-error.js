export class AppError extends Error {
  constructor(statusCode, code, message, fields = undefined) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.fields = fields;
  }
}
