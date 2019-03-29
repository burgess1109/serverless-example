module.exports = class InputError extends Error {
  constructor(message, statusCode) {
    super();
    this.name = 'Input Error';
    this.message = message || 'Miss Parameters';
    this.statusCode = statusCode || 400;
  }
};
