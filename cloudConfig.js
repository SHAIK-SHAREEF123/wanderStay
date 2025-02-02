// This file is for 
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV', //It says that we require a folder called wanderlust_DEVELOPMENT in cloudinary storage
      allowedFormats: ["png","jpg","jpeg"] //This defines the type of files we can store
    },
  });

module.exports= {
    cloudinary,
    storage,
}