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

function configureMiddleware(config) {
  return (req, res, next) => {
    const cookies = req.cookies;

    if (cookies && cookies.token) {
      jwt.verify(cookies.token, config.secret, function(err, decoded) {
        if (err) {
          logJwtError(err);
        } else {
          log.info('ID token verified for user %s', decoded.sub);
          req.loggedInUser = decoded.sub;
        }

        next();
      });
    } else {
      next();
    }
  };
}

module.exports = configureMiddleware;
