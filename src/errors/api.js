const { CAPTCHA_REQUIRED } = require('./../constants').ERROR_CODES;

class VkApiError extends Error {
  /**
   * Constructor.
   * @param  {Object} obj
   */
  constructor(obj = {}) {
    super(obj.error_msg);

    this.name = this.constructor.name;
    this.message = obj.error_msg;
    this.code = obj.error_code;
    this.requestParams = obj.request_params;

    if (this.code === CAPTCHA_REQUIRED) {
      this.captchaSid = obj.captcha_sid;
      this.captchaImg = obj.captcha_img;
    }

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = VkApiError;
