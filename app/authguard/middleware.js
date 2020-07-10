const jwt = require('jsonwebtoken');
const bunyan = require('bunyan');
const log = bunyan.createLogger({name: "AuthGuard Middleware"});

function logJwtError(err) {
  if (err.name) {
    log.info('JWT error %s: %s', err.name, err.message);
  } else {
    log.info(err, 'Unexpected error while verifying the token');
  }
}

function configureMiddleware(config, client) {
  return (req, res, next) => {
    const cookies = req.cookies;

    if (cookies && cookies.token) {
      jwt.verify(cookies.token, config.secret, function(err, decoded) {
        if (err) {
          logJwtError(err);
          next();
        } else {
          log.info('ID token verified for user %s', decoded.sub);

          client.getAccount(decoded.sub)
            .then(account => {
              log.info('User account retrieved %j', account);
              req.loggedInUser = account;
              next();
            })
            .catch(err => {
              log.warn('Failed to get user account %s', decoded.sub);
              res.status(401)
                  .json({
                    error: 'Failed to verify user'
                  });
            });
        }
      });
    } else {
      next();
    }
  };
}

module.exports = configureMiddleware;
