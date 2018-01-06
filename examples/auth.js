const Auth = require('./../src/auth');

const username = '',
  password = '',
  yourClientId = '',
  // official client for test dirrect auth
  iphoneClientId = '3140623',
  iphoneClientSecret = 'VeWdmVclDCtn6ihuP1nt';

let auth = new Auth({
  username: username,
  password: password
});

(async function () {
  console.log('Implicit auth.');

  try {
    let res = await auth.implicit({
      clientId: yourClientId
    });
    console.log(res);
  } catch (error) {
    console.log(error);
  }

  console.log('Direct auth.');

  try {
    let res = await auth.direct({
      clientId: iphoneClientId,
      clientSecret: iphoneClientSecret
    });
    console.log(res);
  } catch (error) {
    console.log(error);
  }
})();
