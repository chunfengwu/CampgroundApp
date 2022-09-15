const express = require('express');
// const user = require('../models/user');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const usersController = require('../controller/users')
// const flash = require('connect-flash/lib/flash');

router.route('/register')
    // render register page
    .get(usersController.renderRegister)
    // register a new user
    .post(usersController.register)

router.route('/login')
    // render login page
    .get(usersController.renderLogin)
    // login a use
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), usersController.login)

// logout a use
router.get('/logout', usersController.logout);


module.exports = router; 