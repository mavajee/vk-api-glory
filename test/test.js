var should = require('chai').should();

var Api = require('./../src/api/index');
var Auth = require('./../src/auth/index');


const CLIENT_ID =  process.env['CLIENT_ID'],
	CLIENT_SECRET = process.env['CLIENT_SECRET'],
	USERNAME = process.env['USERNAME'],
	PASSWORD = process.env['PASSWORD'];


describe('Api', function () {
	this.timeout(900);

	let api = new Api();

	it('call api method "users.get" must return array', function () {
		return api.call('users.get', { user_id: 1 }).then(data => {
			data.should.to.be.an('array').that.to.be.not.empty;
		});
	});
});

describe('Auth', function () {
	this.timeout(900);

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
