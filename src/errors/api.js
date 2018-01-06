class VkApiError extends Error {
  /**
   * Constructor.
   * @param  {Object} obj
   *
   */
  constructor(obj = {}) {
    super(obj.error_msg);

    this.name = this.constructor.name;
    this.message = obj.error_msg;
    this.code = obj.error_code;
    this.requestParams = obj.request_params;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = VkApiError;
