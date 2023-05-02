const Product = require("../models/product.model");
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongoDbId = require("../utils/validateMongodbId");
const cloudinaryUploadImg = require("../utils/cloudinary");
const fs = require("fs");


const createProduct = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    } catch (error) {
        throw new Error(error)
    };
});

const updateProduct = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        };
        const updateProduct = await Product.findOneAndUpdate(id, req.body, { new: true });
        res.json(updateProduct);
    } catch (error) {
        throw new Error(error);
    };
});

const deleteaproduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deleteProduct = await Product.findByIdAndRemove(id);
        res.json(deleteProduct);
    } catch (error) {
        throw new Error(error);
    };
});

const getaproduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {

        const findProduct = await Product.findById(id);
        res.json(findProduct);
    } catch (error) {
        throw new Error(error)
    };
});

const getallproducts = asyncHandler(async (req, res) => {
    try {
        const queryObject = { ...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach((el) => delete queryObject[el]);
        
        let queryStr = JSON.stringify(queryObject);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        let query = Product.find(JSON.parse(queryStr));

        // sotring
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        };
        // limiting the fields
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);

        } else {
            query = query.select('-__v');
        }

        // pagination

        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) throw new Error('This page doesn\'t exits');

        }

        const product = await query;
        res.json(product);
    } catch (error) {
        throw new Error(error);
    }
});

const addToWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { prodId } = req.body;
    try {
        const user = await User.findById(_id);

        const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);
        if (alreadyAdded) {
            let user = await User.findByIdAndUpdate(_id, {
                $pull: { wishlist: prodId}
            }, {
                new: true
            });
            res.json(user);
        } else {
            let user = await User.findByIdAndUpdate(_id, {
                $push: { wishlist: prodId}
            }, {
                new: true
            });
            res.json(user);
        }
    } catch (error) {
        throw new Error(error);
    }   
});

const rating = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, prodId, comment } = req.body;
    const product = await Product.findById(prodId);
    let alreadyRated = product.ratings.find((userId) => userId.postedby.toString() === _id.toString());
    try {       
        if (alreadyRated) {
            const updateRating = await Product.updateOne(
                {
                    ratings: { $elemMatch: alreadyRated }
                },
                {
                    $set: {"ratings.$.star": star, "ratings.$.comment": comment }
                }, 
                {
                    new: true
                }
            );
        } else {
            const rateProduct = await Product.findByIdAndUpdate(prodId, {
                $push: {
                    ratings: {
                        star: star,
                        comment: comment,
                        postedby: _id,
                    }
                }
            }, {
                new: true
            })
        }
    const getAllRatings = await Product.findById(prodId);
    let totalRating = getAllRatings.ratings.length;
    let ratingSum = getAllRatings.ratings
        .map((item) => item.star)
        .reduce((pre, curr) => pre += curr, 0);
    
    console.log(totalRating, ratingSum);
    let actualRating = Math.round(Number(ratingSum) / Number(totalRating));
    let finalproduct = await Product.findByIdAndUpdate(prodId, 
        {
            totalrating: actualRating
        }, 
        {
            new: true
        }
    );
    res.json(finalproduct);
    } catch (error) {
        throw new Error(error);
    }
});

const uploadImages = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const uploader = (path) => cloudinaryUploadImg(path, 'images');
        const urls = [];
        const files = req.files;

        for (const file of files) {
            const { path } = file;
            const newpath = await uploader(path);
            urls.push(newpath);
            fs.unlinkSync(path);
        };
        const findProduct = await Product.findByIdAndUpdate(id, {
            images: urls.map(file => {
                return file;
            }, { new: true}),
        });
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
});


module.exports = {
    createProduct,
    getaproduct,
    getallproducts,
    updateProduct,
    deleteaproduct,
    addToWishlist,
    rating,
    uploadImages    
}