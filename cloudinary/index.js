const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');// multer upload the files to cloudinary

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.SECRET
})


const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'CampApp',
        allowedFormats: ['jpg', 'png', 'jpeg']
    }
})

module.exports = {
    cloudinary,
    storage
}