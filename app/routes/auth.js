const express = require('express');
const bunyan = require('bunyan');
const log = bunyan.createLogger({name: "AuthRouter"});

const router = express.Router();

function handleErrors(error, res) {
  if (error.response) {
    log.error('Non-successful call to AuthGuard server %d, %j, %j',
                error.response.status,
                error.response.headers,
                error.response.data);

    res.status(error.response.status)
      .json({
        error: error.response.data
      });
  } else if (error.request) {
    log.error('Failed to communicate with AuthGuard server');

    res.status(500)
      .json({
        error: 'No response from the authentication provider'
      });
  } else {
    log.error('Unexpected error %s', error.message);
  }
}

function errorHandler(res) {
  return (error) => handleErrors(error, res);
}

function setupRoutes(authguard) {
  router.post('/authn', (req, res) => {
    const body = req.body;

    if (body.username && body.password) {
      authguard.login(body.username, body.password)
        .then(response => {
          res.status(200).json({
            token: response.token
          });
        })
        .catch(errorHandler(res));
    } else {
      res.status(400).send({
        error: 'Expecting username and password to be provided'
      });
    }
  });

  router.post('/signup', (req, res) => {
    // TODO create the user's profile first and use its ID as externalId
    const body = req.body;
    const accountBody = {
      externalId: null,
      roles: ['user'], // read from config
      emails: [
        {
          email: body.email,
          primary: true
        }
      ]
    };

    if (body) {
      authguard.createAccount(accountBody)
        .then(createdAccount => {
          const accountId = createdAccount.id;
          const credentialsBody = {
            accountId: accountId,
            identifiers: [
              {
                type: "USERNAME",
                identifier: body.username
              },
              {
                type: "EMAIL",
                identifier: body.email
              }
            ],
            plainPassword: body.password
          };

          return authguard.createCredentials(credentialsBody);
        })
        .then(createdCredentials => {
          res.status(201);
          res.json({
            accountId: createdCredentials.accountId
          });
        })
        .catch(errorHandler(res));
    } else {
      res.status(400);
      res.json({});
    }
  });

  return router;
}

module.exports = setupRoutes;
