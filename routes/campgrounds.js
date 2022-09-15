const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const catchAsync = require('../utilies/catchAsync');
const campgroundsController = require('../controller/campgrounds');
// const ExpressError = require('../utilies/Expresserror');
// const { campgroundSchema } = require('../schema.js');
const { isLogin, isAuthor, validateCampground } = require('../middleware');

router.route('/')
    .get(catchAsync(campgroundsController.index)) // show the list of campgounds
    .post(isLogin, validateCampground,
        catchAsync(campgroundsController.createCampground)) // receive the create new camp post req and create the new camp

// show the page of create new camps. Need to position before :id route
router.get('/new', isLogin, catchAsync(campgroundsController.renderNewForm));

router.route('/:id')
    .get(catchAsync(campgroundsController.showCampground)) // show the detailed camp info
    .put(isLogin, isAuthor, validateCampground, catchAsync(campgroundsController.updateCampground)) // receive the edit req and update it
    .delete(isLogin, isAuthor, catchAsync(campgroundsController.deleteCampground)) // delete a camp

// the edit page of a camp
router.get('/:id/edit', isLogin, isAuthor, catchAsync(campgroundsController.renderEditForm));


module.exports = router;