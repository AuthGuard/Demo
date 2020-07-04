const axios = require('axios');

function headers(key) {
  return {
    headers: {
      'authorization': 'Bearer ' + key
    }
  };
}

function create(config) {
  const client = axios.create({
    baseURL: config.baseUrl,
    timeout: 1000
  });

  return {
    login: (username, password) => {
      const buff = Buffer.from(username + ':' + password);
      const basic = 'Basic ' + buff.toString('base64');

      const body = {
        authorization: basic
      };

      const responsePromise =
        axios.post(config.baseUrl + '/auth/authenticate', body, headers(config.key))
          .then(response => response.data);

      return responsePromise;
    },


    createAccount: (account) => {
      const responsePromise =
        axios.post(config.baseUrl + '/accounts', account, headers(config.key))
          .then(response => response.data);

      return responsePromise;
    },


    createCredentials: (credentials) => {
      const responsePromise =
        axios.post(config.baseUrl + '/credentials', credentials, headers(config.key))
          .then(response => response.data);

      return responsePromise;
    }
  };
}

module.exports = create;
