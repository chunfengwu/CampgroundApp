const Campground = require('../models/campground');

module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = async (req, res, next) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename })) // multer save uploaded files as arry in req.files. Take each uploaed file's path and filename to Campground Schema
    campground.author = req.user._id; // when a user create a new camp, need to save the current login user to Camp schema
    await campground.save();
    console.log(campground)
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: 'author'
    }).populate("author");
    if (!campground) {
        req.flash('error', 'Cannot find that campgound!')
        return res.redirect('/campgounds')
    }
    // console.log(campground);
    res.render('campgrounds/show', { campground }); // {campground, msg: req.flash('success')} replaced by a middleware
}

module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campgound!')
        return res.redirect('/campgounds')
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
    const newImgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...newImgs);
    await campground.save();
    req.flash('success', 'Successfully updated campground!');
    // res.send(updatedCamp)
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}