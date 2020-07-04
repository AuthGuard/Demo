const express = require('express');
const router = express.Router();

function verifyLoggedIn(req, res) {
  if (!req.loggedInUser) {
    res.redirect('/login');
    return false;
  }
}

router.get('/', (req, res, next) => {
  if (verifyLoggedIn(req, res)) {
    res.redirect('/dashboard');
  }
});

router.get('/dashboard', (req, res, next) => {
  if (verifyLoggedIn(req, res)) {
    res.render('pages/index');
  }
});

router.get('/login', (req, res, next) => {
  res.render('pages/login');
});

router.get('/register', (req, res, next) => {
  res.render('pages/register');
});

router.get('/reset', (req, res, next) => {
  res.render('pages/password');
});

module.exports = router;
