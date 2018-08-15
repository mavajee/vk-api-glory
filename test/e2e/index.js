const should = require('chai').should();

const Api = require('../../src/api/index');
const Auth = require('../../src/auth/index');

const TIMEOUT = process.env['TIMEOUT'] || 900;
const CLIENT_ID = process.env['CLIENT_ID'];
const CLIENT_SECRET = process.env['CLIENT_SECRET'];
const USERNAME = process.env['USERNAME'];
const PASSWORD = process.env['PASSWORD'];

describe('Auth', function () {
  this.timeout(TIMEOUT);

  let auth = new Auth({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    username: USERNAME,
    password: PASSWORD
  });

  it('direct auth result should contain access token and user id', () => {
    return auth.direct().then(data => {
      data.should.contain.all.keys(['accessToken', 'userId']);
    });
  });
});

describe('Api', function () {
  this.timeout(TIMEOUT);

  before(function (done) {
    let auth = new Auth({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      username: USERNAME,
      password: PASSWORD
    });

    auth.direct().then(data => {
      this.api = new Api({ accessToken: data.accessToken })
      done();
    })
  });

  it('call api method "users.get" must return array', function () {
    return this.api.call('users.get', { user_id: 1 }).then(data => {
      data.should.to.be.an('array').that.to.be.not.empty;
    });
  });
});
