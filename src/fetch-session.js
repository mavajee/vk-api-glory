const fetch = require('node-fetch');

const MAIN_OPTS = {
  credentials: 'include',
  redirect: 'manual'
};

/**
 * Wrapper for a `fetch` function to support session.
 * WARNING!!! Because it's need only for implicit vk auth, it don't care about path or domain
 * and it can and must use only for one domain.
 *
 * @param {Object} initOpts
 * @returns {fetch} fetch function
 */
module.exports = function fetchSession(initOpts) {
  let cookieStore = new SimpleCookieStore;

  return function _fetchWithCookie(url, opts) {
    opts = Object.assign({}, initOpts, opts);

    let headers = opts.headers || {};
    headers.cookie = cookieStore.stringify();

    opts = Object.assign({}, opts, MAIN_OPTS, { headers });

    return fetch(url, opts).then(response => {
      let cookies = response.headers.getAll('Set-Cookie');

      cookieStore.set(cookies);

      if (response.status === 301 || response.status === 302 || response.status === 303) {
        return _fetchWithCookie(response.headers.get('location'), {
          method: 'GET',
          body: null
        })
      }

      return response;
    })
  }
};

/**
 * SimpleCookieStore Class
 * @class
 */
class SimpleCookieStore {
  /**
   * Simple cookie store without split by domain and path.
   */
  constructor() {
    this.cookies = {};
  }

  /**
   * Parse and set cookie from response headers set-cookie.
   * @param {Array | string} cookie
   * @public
   */
  set(cookie) {
    if (typeof cookie === 'string') {
      cookie = Array(cookie);
    }

    for (let _c of cookie) {
      _c = _c.split('; ');
      // ignore path, domain, expires.
      let [name, value] = _c[0].split('=');
      if (value === 'DELETED' || value === '') {
        delete this.cookies[name];
      } else {
        this.cookies[name] = value;
      }
    }
  }

  /**
   * Get cookies string.
   * @returns {string} cookies
   * @public
   */
  stringify() {
    return Object.entries(this.cookies).map(e => e.join('=')).join('; ');
  }
}
