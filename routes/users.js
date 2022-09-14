const express = require('express');
const user = require('../models/user');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
// const flash = require('connect-flash/lib/flash');


router.get('/register', async (req, res) => {
    res.render('users/register')
});


router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'welcome to YelpCamp!')
            res.redirect('/campgrounds')
        })

    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
});

router.get('/login', async (req, res) => {
    res.render('users/login')
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logout!');
        res.redirect('/campgrounds');
    }); // new logout verison need a call back
});


module.exports = router; 