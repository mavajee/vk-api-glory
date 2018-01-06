class AuthError extends Error {
  /**
   * Constructor.
   *
   * @param  {Object} obj
   */
  constructor (obj = {}) {
    let message = obj['error_description'] || obj.message || 'Unknown error';

    super(message);

    this.name = this.constructor.name;
    this.message = message;
    this.type = obj.error;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AuthError;
