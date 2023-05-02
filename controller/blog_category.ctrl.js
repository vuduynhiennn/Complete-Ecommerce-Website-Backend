const blogCategory = require("../models/blog_category.model");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createbCategory = asyncHandler(async(req, res) => {
    try {
        const newbCategory = await blogCategory.create(req.body);
        res.json(newbCategory);
    } catch (error) {
        throw new Error(error);
    }
});

const updatebCategory = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatebCategory = await blogCategory.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatebCategory);
    } catch (error) {
        throw new Error(error);
    }
});

const deletebCategory = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const deletebCategory = await blogCategory.findByIdAndDelete(id, { new: true });
        res.json(deletebCategory);
    } catch (error) {
        throw new Error(error);
    }
});

const getallbcategories = asyncHandler(async(req, res) => {
    try {
        const allbcategories = await blogCategory.find();
        res.json(allbcategories);
    } catch (error) {
        throw new Error(error);
    }
});

const getabcategory = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const bcategory = await blogCategory.findById(id);
        res.json(bcategory);
    } catch (error) {
        throw new Error(error);
    }
});


module.exports = {
    createbCategory,
    getallbcategories,
    getabcategory,
    updatebCategory,
    deletebCategory
}