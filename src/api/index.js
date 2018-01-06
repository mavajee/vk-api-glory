const fetch = require('node-fetch');
const qs = require('querystring');

const apiError = require('./../errors/api');
const { API_VERSION, LANG } = require('./../constants');

const API_URL = 'https://api.vk.com/method/';

class VkApi {
  /**
   * Constructor
   *
   * @param {object} options
   *   @property {string} accessToken
   *   @property {string|number} apiVersion
   *   @property {function} recognizeCaptcha
   */
  constructor({
    accessToken,
    apiVersion = API_VERSION,
    lang = LANG,

    recognizeCaptcha
  } = {}) {
    this.accessToken = accessToken;
    this.apiVersion = apiVersion;
    this.lang = lang;

    this.recognizeCaptcha = recognizeCaptcha;
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

    let requestBody = Object.assign({
      access_token: this.accessToken || params.accessToken,
      lang: this.lang || params.lang,
      v: this.apiVersion || params.apiVersion
    }, params);

    return fetch(`${API_URL}/${methodName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      timeout: 4500,
      body: qs.stringify(requestBody)
    }).then(response => response.json())
      .then(json => {
        if (json.error) {
          return Promise.reject(new apiError(json.error));
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
   * @public
   */
  setAccessToken(accessToken) {
    this.accessToken = accessToken;

    return this;
  }

  /**
   * Set api version
   * @param {string|number} apiVersion
   * @public
   */
  setApiVersion(apiVersion) {
    this.apiVersion = apiVersion;

    return this;
  }

}

module.exports = VkApi;
