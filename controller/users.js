const User = require('../models/user');

module.exports.renderRegister = async (req, res) => {
    res.render('users/register')
};

module.exports.register = async (req, res) => {
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
};

module.exports.renderLogin = async (req, res) => {
    res.render('users/login')
};


module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    // isLogin middleware was trigered when visit New campground page, will save the originalURL to returnTo.
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logout!');
        res.redirect('/campgrounds');
    }); // new logout verison need a call back
};
