const fetch = require('node-fetch');
const qs = require('querystring');
const { URL } = require('url');

const ApiError = require('./../errors/api');
const { API_VERSION, LANG, ERROR_CODES } = require('./../constants');

const API_URL = 'https://api.vk.com/method/';

class Api {
  /**
   * Constructor
   *
   * @param {object} options
   *   @property {string} accessToken
   *   @property {string|number} apiVersion
   *   @property {string} [lang="ru"]
   *   @property {function} captchaHandler
   */
  constructor({
    accessToken,
    apiVersion = API_VERSION,
    lang = LANG,

    captchaHandler
  } = {}) {
    this.accessToken = accessToken;
    this.apiVersion = apiVersion;
    this.lang = lang;

    this.captchaHandler = captchaHandler;
  }

  /**
   * Call vk api method by raw
   *
   * @param {string} methodName
   * @param {Object} params
   * @return {Promise<Object>}
   * @public
   */
	call(methodName, params = {}) {
		if (typeof methodName !== 'string') {
			return Promise.reject(new Error('Attribute Error. `methodName` must be a string.'));
		}

		let retry = (_p) => (
			this.call(methodName, {
				...params,
				..._p
			})
		);

		let requestBody = {
			access_token: this.accessToken || params.accessToken || params.access_token,
			lang: this.lang || params.lang,
			v: this.apiVersion || params.apiVersion || params.v,

			...params
		};

		return fetch(new URL(methodName, API_URL).toString(), {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
			timeout: 4500,
			body: qs.stringify(requestBody)
		})
			.then(response => response.json())
			.then(json => {
				if (json.error) {
					const error = new ApiError(json.error);

					if (error.code === ERROR_CODES.CAPTCHA_REQUIRED && this.captchaHandler) {
						return this.handleCaptcha(error, retry);
					}

					return Promise.reject(error);
				}

				// Return full response, because it can include "execute_errors".
				if (methodName.startsWith('execute')) {
					return json;
				}

				return json.response;
			})
	}

  /**
   * Set access token
   * @param {string} accessToken
   * @returns {Api}
   * @public
   */
  setAccessToken(accessToken) {
    this.accessToken = accessToken;

    return this;
  }

  /**
   * Set api version
   * @param {string|number} apiVersion
   * @return {Api}
   * @public
   */
  setApiVersion(apiVersion) {
    this.apiVersion = apiVersion;

    return this;
  }

  /**
   * Set a captcha handler
   * @param {function} handler – this function getting captchaImg and must
   *   returns a promise with captcha key
   * @returns {Api}
   * @public
   */
  setCaptchaHandler(handler) {
    this.captchaHandler = handler;

    return this;
  }

  /**
   * @param {object}
   *   @property {string} captchaSid
   *   @property {string} captchaImg
   * @param {function} reCall
   * @returns {Promise}
   * @private
   */
	handleCaptcha({ captchaSid, captchaImg }, reCall) {
		return this.captchaHandler(captchaImg)
			.then(captchaKey => (
				reCall({
					captcha_sid: captchaSid,
					captcha_key: captchaKey
				})
			)
			)
	}
}

module.exports = Api;
