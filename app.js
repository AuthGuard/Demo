'use strict';

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const authguardConfig = require('./config/authguard');
const authguardClient = require('./authguard/client')(authguardConfig);
const authguardMiddleware = require('./authguard/middleware')(authguardConfig, authguardClient);

const pagesRouter = require('./routes/pages');
const authRouter = require('./routes/auth')(authguardClient);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// general middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// auth middleware
app.use(authguardMiddleware);

// routes
app.use('/api/auth', authRouter);
app.use('/', pagesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.error(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  const status = err.status || 500;

  res.status(status);

  switch (status) {
    case 401:
      res.render('pages/401');
      break;

    case 404:
      res.render('pages/404');
      break

    default:
      res.render('pages/500');
  }
});

module.exports = app;
