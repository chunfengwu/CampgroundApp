const express = require('express');
const router = express.Router();
const Campground = require('../models/campground')
const catchAsync = require('../utilies/catchAsync')
const ExpressError = require('../utilies/Expresserror');
const { campgroundSchema } = require('../schema.js');
const { isLogin } = require('../middleware')


const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',');
        throw new ExpressError(message, 400)
    } else {
        next();
    }
}
// show the list of campgounds
router.get('/', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));
// show the page of create new camps. 
router.get('/new', isLogin, catchAsync(async (req, res, next) => {
    res.render('campgrounds/new');
}));
// receive the create new camp post req and handel the req
router.post('/', isLogin, validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) {
    //     throw new ExpressError("Invalid Campground Data", 404);
    // }
    const campground = new Campground(req.body.campground)
    await campground.save();
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`)
}));
// show the detailed camp info
router.get('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate("reviews").populate("author");
    if (!campground) {
        req.flash('error', 'Cannot find that campgound!')
        return res.redirect('/campgounds')
    }
    // console.log(campground);
    res.render('campgrounds/show', { campground }); // {campground, msg: req.flash('success')} replaced by a middleware
}));

// the edit page of a camp
router.get('/:id/edit', isLogin, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campgound!')
        return res.redirect('/campgounds')
    }
    res.render('campgrounds/edit', { campground });
}));
// receive the edit req and handle it
router.put('/:id', isLogin, validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
    req.flash('success', 'Successfully updated campground!');
    // res.send(updatedCamp)
    res.redirect(`/campgrounds/${id}`)
}));
// delete a camp
router.delete('/:id', isLogin, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}));

module.exports = router;