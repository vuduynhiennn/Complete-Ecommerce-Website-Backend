const Brand = require("../models/brand.model");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createBrand = asyncHandler(async(req, res) => {
    try {
        const newBrand = await Brand.create(req.body);
        res.json(newBrand);
    } catch (error) {
        throw new Error(error);
    }   
});

const updateBrand = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updateBrand = await Brand.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updateBrand);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteBrand = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const deleteBrand = await Brand.findByIdAndDelete(id, { new: true });
        res.json(deleteBrand);
    } catch (error) {
        throw new Error(error);
    }
});

const getallbrands = asyncHandler(async(req, res) => {
    try {
        const allbrands = await Brand.find();
        res.json(allbrands);
    } catch (error) {
        throw new Error(error);
    }
});

const getaBrand = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const brand = await Brand.findById(id);
        res.json(brand);
    } catch (error) {
        throw new Error(error);
    }
});


module.exports = {
    createBrand,
    getallbrands,
    getaBrand,
    updateBrand,
    deleteBrand
}