const prodCategory = require("../models/prod_category.model");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createCategory = asyncHandler(async(req, res) => {
    try {
        const newCategory = await prodCategory.create(req.body);
        res.json(newCategory);
    } catch (error) {
        throw new Error(error);
    }
});

const updateCategory = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updateCategory = await prodCategory.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updateCategory);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteCategory = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const deleteCategory = await prodCategory.findByIdAndDelete(id, { new: true });
        res.json(deleteCategory);
    } catch (error) {
        throw new Error(error);
    }
});

const getallcategories = asyncHandler(async(req, res) => {
    try {
        const allcategories = await prodCategory.find();
        res.json(allcategories);
    } catch (error) {
        throw new Error(error);
    }
});

const getacategory = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const category = await prodCategory.findById(id);
        res.json(category);
    } catch (error) {
        throw new Error(error);
    }
});


module.exports = {
    createCategory,
    getallcategories,
    getacategory,
    updateCategory,
    deleteCategory
}