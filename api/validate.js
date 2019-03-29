const InputError = require('./inputError');

module.exports = class Validate {
  constructor(input) {
    if (!input) {
      throw new InputError();
    }
    this.input = input;
  }
  message() {
    if (typeof this.input.name === 'undefined' || typeof this.input.message === 'undefined') {
      throw new InputError();
    }
  }
};
