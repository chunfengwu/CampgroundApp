const Campground=require('../models/campground');
const { cloudinary }=require('../cloudinary');
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken=process.env.MAPBOX_TOKEN;
const geocoder=mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index=async (req, res, next) => {
    const campgrounds=await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm=async (req, res, next) => {
    res.render('campgrounds/new');
}

module.exports.createCampground=async (req, res, next) => {
    const geoData=await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const campground=new Campground(req.body.campground)
    // console.log(geoData.body.features)
    campground.geometry=geoData.body.features[0].geometry; // get the longitude and lagitude and save to the schema
    campground.images=req.files.map(f => ({ url: f.path, filename: f.filename })) // multer save uploaded files as arry in req.files. Take each uploaed file's path and filename to Campground Schema
    campground.author=req.user._id; // when a user create a new camp, need to save the current login user to Camp schema
    await campground.save();
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground=async (req, res, next) => {
    const { id }=req.params;
    const campground=await Campground.findById(id).populate({
        path: 'reviews',
        populate: 'author'
    }).populate("author");
    if (!campground) {
        req.flash('error', 'Cannot find that campgound!')
        return res.redirect('/campgounds')
    }
    res.render('campgrounds/show', { campground }); // {campground, msg: req.flash('success')} replaced by a middleware
}

module.exports.renderEditForm=async (req, res, next) => {
    const { id }=req.params;
    const campground=await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campgound!')
        return res.redirect('/campgounds')
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground=async (req, res, next) => {
    const { id }=req.params;
    // console.log(req.body);
    const campground=await Campground.findByIdAndUpdate(id, req.body.campground);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    };
    const newImgs=req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...newImgs);
    await campground.save();
    req.flash('success', 'Successfully updated campground!');
    // res.send(updatedCamp)
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground=async (req, res, next) => {
    const { id }=req.params;
    const campground=await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}