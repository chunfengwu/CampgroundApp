const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const catchAsync = require('../utilies/catchAsync');
const campgroundsController = require('../controller/campgrounds');
// const ExpressError = require('../utilies/Expresserror');
// const { campgroundSchema } = require('../schema.js');
const { isLogin, isAuthor, validateCampground } = require('../middleware');
const multer = require('multer') // parsr files from data
const { storage } = require('../cloudinary')
const upload = multer({ storage }) // define the img upload to cloudinarty storage. Will auot create a local 'uploads' folder if save des is dest: 'uploads/'


router.route('/')
    // show the list of campgounds
    .get(catchAsync(campgroundsController.index))
    // receive the create new camp post req and create the new camp
    .post(isLogin, upload.array('image'), validateCampground, catchAsync(campgroundsController.createCampground))

// show the page of create new camps. Need to position before :id route
router.get('/new', isLogin, catchAsync(campgroundsController.renderNewForm));

router.route('/:id')
    // show the detailed camp info
    .get(catchAsync(campgroundsController.showCampground))
    // receive the edit req and update it
    .put(isLogin, isAuthor, upload.array('image'), validateCampground, catchAsync(campgroundsController.updateCampground))
    // delete a camp
    .delete(isLogin, isAuthor, catchAsync(campgroundsController.deleteCampground))

// show the edit page of a camp
router.get('/:id/edit', isLogin, isAuthor, catchAsync(campgroundsController.renderEditForm));


module.exports = router;