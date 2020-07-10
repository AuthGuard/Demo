const express = require('express');
const router = express.Router();

const adminRole = 'admin';

function verifyLoggedIn(req, res) {
  if (!req.loggedInUser) {
    res.redirect('/login');
    return false;
  }
  return true;
}

router.get('/', (req, res, next) => {
  if (verifyLoggedIn(req, res)) {
    res.redirect('/dashboard');
  }
});

router.get('/dashboard', (req, res, next) => {
  if (verifyLoggedIn(req, res)) {
    console.log('Verified');
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

router.get('/admin', (req, res) => {
  if (verifyLoggedIn(req, res)) {
    if (req.loggedInUser.roles.indexOf(adminRole) != -1) {
      res.render('pages/index');
    } else {
      res.render('pages/403');
    }
  }
})

module.exports = router;
