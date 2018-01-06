const querystring = require('querystring');
const { URL, URLSearchParams } = require('url');

const AuthError = require('./../errors/auth');
const fetchSession = require('./../utils/fetch-session');
const { extractAuthForm, getElementsBodyByClassName } = require('./../utils/html-helpers');
const { API_VERSION, ANDROID_CHROME_USER_AGENT, userScopes } = require('./../constants');


const IMPLICIT_AUTH_URL = 'https://oauth.vk.com/authorize';
const DIRECT_AUTH_URL = 'https://oauth.vk.com/token';


class Auth {
  /**
   * Constructor
   * 
   * @param {Object} options
   *   @property {string} username
   *   @property {string} password
   *   @property {string|number} clientId
   *   @property {string} clientSecret
   *   @property {string} scope
   *   @property {string|number} version  
   */
  constructor({
      username,
    password,
    clientId,
    clientSecret,
    scope = userScopes.join(','),
    version = API_VERSION,
    } = {}
  ) {

    this.username = username;
    this.password = password;
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.scope = scope;
    this.version = version;

    // this.captchaHandler = undefined;
  }

  /**
   * Implicit user authorization for standalone apps.
   * This auth type does not work any more with official apps like ios, android etc. 
   * https://vk.com/dev/implicit_flow_user
   * @param {Object}
   *   @property {string|number} clientId
   *   @property {string} clientSecret
   *   @property {string} scope
   * @returns {Promise<object>}
   * @public
   */
  implicit({
      clientId = this.clientId,
      clientSecret = this.clientSecret,
      scope = this.scope
  } = {}) {
    let fetch = fetchSession({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'User-Agent': ANDROID_CHROME_USER_AGENT
      }
    });

    let params = querystring.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      scope: scope,
      v: this.version,
      display: 'mobile',
      response_type: 'token',
      redirect_uri: 'https://oauth.vk.com/blank.html'
    });

    return fetch(`${IMPLICIT_AUTH_URL}?${params}`)
      .then(response => this._processError(response))
      .then(response => response.text())
      .then(body => extractAuthForm(body))
      .then(form => {
        form.fields.email = this.username;
        form.fields.pass = this.password;

        return fetch(form.attrs.action, {
          body: querystring.stringify(form.fields),
          method: 'POST'
        })
      })
      .then(response => {
        if (response.url.includes('authorize')) {
          return response.text()
            .then(body => {
              let errors = getElementsBodyByClassName(body, 'box_error', 'div');
              let services = getElementsBodyByClassName(body, 'service_msg_warning', 'div');

              if (errors.length || services.length) {
                return Promise.reject(
                  new Error(errors.length ? errors[0] : services[0])
                )
              }

              return body
            })
            .then(body => extractAuthForm(body))
            .then(form =>
              fetch(form.attrs.action, {
                body: querystring.stringify(form.fields),
                method: 'POST'
              })
            )
        }

        return response;
      })
      .then(response => this._processError(response))
      .then(response => {
        let { hash } = new URL(response.url);

        if (hash.startsWith('#')) {
          hash = hash.substring(1);
        }

        const params = new URLSearchParams(hash);

        if (params.has('error') || !params.has('access_token')) {
          return Promise.reject(new AuthError({
            message: params.get('error_description'),
            error: params.get('error')
          }));
        }

        return {
          userId: params.get('user_id') || undefined,
          expires: params.get('expires_in') || undefined,
          accessToken: params.get('access_token')
        }
      })
  }

  /**
   * Direct user authorization only for approved or official apps.
   * https://vk.com/dev/auth_direct
   * @param {Object}
   *   @property {string|number} clientId
   *   @property {string} clientSecret
   *   @property {string} scope
   * @returns {Promise<object>}
   * @public
   */
  direct({
    clientId = this.clientId,
    clientSecret = this.clientSecret,
    scope = this.scope 
  } = {}) {
    let fetch = fetchSession({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    });

    let params = querystring.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      username: this.username,
      password: this.password,
      scope: scope,
      grant_type: 'password',
      v: this.version
    });

    return fetch(`${DIRECT_AUTH_URL}?${params}`)
      .then(response => response.json())
      .then(response => {
        if (response.error) {
          return Promise.reject(new AuthError(response))
        }

        this.accessToken = response.access_token;

        return {
          userId: response['user_id'],
          expires: response['expires_in'],
          accessToken: response['access_token']
        }
      });
  }

  // /**
  //  * Sets captcha handler
  //  * @param {Function} handler
  //  * @returns {this}
  //  * @public
  //  */
  // setCaptchaHandler(handler) {
  //   this.captchaHandler = handler;
  //
  //   return this;
  // }

  /**
   * @param {Object} response 
   * @private
   */
  _processError(response) {
    return new Promise((resolve, reject) => {
      if (response.status !== 200) {
        return response.text().then(data => {
          let error;

          try {
            error = JSON.parse(data);
          } catch (e) {
            error = {};
          }

          return reject(new AuthError(error))
        })
      }

      return resolve(response);
    })
  }
}

module.exports = Auth;
