const express = require('express');
const router = express.Router({ mergeParams: true });
// const Review = require('../models/review');
// const Campground = require('../models/campground')
const catchAsync = require('../utilies/catchAsync')
const ExpressError = require('../utilies/Expresserror');
const { campgroundReveiw } = require('../schema.js');
const { validateReview, isLogin, isReviewAuthor } = require('../middleware')
const reviewsController = require('../controller/reviews')

// create a review
router.post('/', isLogin, validateReview, catchAsync(reviewsController.createReview));

// delete a review
router.delete('/:reviewId', isLogin, isReviewAuthor, catchAsync(reviewsController.deleteReview));

module.exports = router;