const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.SECRET_KEY
});

const cloudinaryUploadImg = async (filetoUpLoads) => {
    return new Promise((resolve) => {
        cloudinary.uploader.upload(filetoUpLoads, (result) => {    
            resolve({
                url: result.secure_url,
                asset_id: result.asset_id,
                public_id: result.public_id
            }, {
                resource_type: "auto"
            })
        })
    })
};

const cloudinaryDeleteImg = async (filetoDelete) => {
    return new Promise((resolve) => {
        cloudinary.uploader.destroy(filetoDelete, (result) => {    
            resolve({
                url: result.secure_url,
                asset_id: result.asset_id,
                public_id: result.public_id
            }, {
                resource_type: "auto"
            })
        })
    })
};

module.exports = {
    cloudinaryUploadImg,
    cloudinaryDeleteImg
};