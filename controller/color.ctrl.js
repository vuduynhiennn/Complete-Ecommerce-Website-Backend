const Color = require("../models/color.model");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createColor = asyncHandler(async(req, res) => {
    try {
        const newColor = await Color.create(req.body);
        res.json(newColor);
    } catch (error) {
        throw new Error(error);
    }   
});

const updateColor = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updateColor = await Color.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updateColor);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteColor = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const deleteColor = await Color.findByIdAndDelete(id, { new: true });
        res.json(deleteColor);
    } catch (error) {
        throw new Error(error);
    }
});

const getallColors = asyncHandler(async(req, res) => {
    try {
        const allColors = await Color.find();
        res.json(allColors);
    } catch (error) {
        throw new Error(error);
    }
});

const getaColor = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const color = await Color.findById(id);
        res.json(color);
    } catch (error) {
        throw new Error(error);
    }
});


module.exports = {
    createColor,
    getallColors,
    getaColor,
    updateColor,
    deleteColor
}