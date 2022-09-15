const express = require('express');
const router = express.Router({ mergeParams: true });
const Review = require('../models/review');
const Campground = require('../models/campground')
const catchAsync = require('../utilies/catchAsync')
const ExpressError = require('../utilies/Expresserror');
const { campgroundReveiw } = require('../schema.js');
const { validateReview, isLogin, isReviewAuthor } = require('../middleware')


router.post('/', isLogin, validateReview, catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully added review!');
    res.redirect(`/campgrounds/${campground._id}`);
}))
// delete a review
router.delete('/:reviewId', isLogin, isReviewAuthor, catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;