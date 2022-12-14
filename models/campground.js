const { string }=require('joi');
const mongoose=require('mongoose');
const { campgroundSchema }=require('../schema');
const Schema=mongoose.Schema;
const Review=require('./review')

// 'https://res.cloudinary.com/dh9y1pv65/image/upload/v1663268577/CampApp/myfkdlwmv3vakujhgee3.jpg'

const imageSchema=new Schema({
    url: String,
    filename: String
})

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_100')
}) // store the samller image url as a virtual property of images

const opts={ toJSON: { virtuals: true } };

const CamproundSchema=new Schema({
    title: String,
    images: [imageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
}, opts);

CamproundSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.location}</p>
    <p>${this.description.substring(0, 50)}...</p>`
})

CamproundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({ _id: { $in: doc.reviews } })
    }
})

module.exports=mongoose.model('Campground', CamproundSchema);