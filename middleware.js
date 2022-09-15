const Campground = require('./models/campground');
const Review = require('./models/review')
const { campgroundSchema, campgroundReveiw } = require('./schema.js'); //joi validate
const ExpressError = require('./utilies/Expresserror');



module.exports.isLogin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // console.log(req.path)
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!')
        return res.redirect('/login') // make sure to return
    }
    next(); // make sure to pass to next
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', "Sorry, you don't have permission");
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', "Sorry, you don't have permission");
        return req.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',');
        throw new ExpressError(message, 400)
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = campgroundReveiw.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',');
        throw new ExpressError(message, 400)
    } else {
        next();
    }
}