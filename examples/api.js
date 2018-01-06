const VkApi = require('./../src/api');

const accessToken = '';

let vkApi = new VkApi({ accessToken });

vkApi.call('users.get')
  .then(data => console.log(data))
  .catch(error => console.log(error));
