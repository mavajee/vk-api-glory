module.exports = {
  /**
   * Api version
   * @type {string}
   */
  API_VERSION: '5.69',

  /**
   * Api language
   * @type {string}
   */
  LANG: 'ru',

  /**
   * All user permission scopes
   * https://vk.com/dev/permissions
   * @type {Array}
   */
  userScopes: [
    'notify',
    'friends',
    'photos',
    'audio',
    'video',
    'pages',
    'status',
    'notes',
    'messages',
    'wall',
    'ads',
    'offline',
    'docs',
    'groups',
    'notifications',
    'stats',
    'email',
    'market'
  ],

  ERROR_CODES: {
    AUTH_FAILURE: 5,
    TOO_MANY_REQUESTS: 6,
    FLOOD_CONTROL: 9,
    CAPTCHA_NEEDED: 14,
    USER_VALIDATION_REQUIRED: 17,
  },

  /**
   * Android chrome browser user agent
   * @type {string}
   */
  ANDROID_CHROME_USER_AGENT: 'Mozilla/5.0 (Linux; Android 6.0.1; SM-T800 Build/MMB29K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.107 Safari/537.36'
};