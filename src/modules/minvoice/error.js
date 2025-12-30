export class MinvoiceError extends Error {
  constructor(code, message, data = null) {
    super(message);
    this.name = "MinvoiceError";
    this.code = code;
    this.data = data;
  }
}
