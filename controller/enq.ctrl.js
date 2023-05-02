const Enquiry = require("../models/enq.model");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createEnquiry = asyncHandler(async(req, res) => {
    try {
        const newEnquiry = await Enquiry.create(req.body);
        res.json(newEnquiry);
    } catch (error) {
        throw new Error(error);
    }   
});

const updateEnquiry = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updateEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updateEnquiry);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteEnquiry = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteEnquiry = await Enquiry.findByIdAndDelete(id, { new: true });
        res.json(deleteEnquiry);
    } catch (error) {
        throw new Error(error);
    }
});

const getallEnquiries = asyncHandler(async(req, res) => {
    try {
        const allEnquiries = await Enquiry.find();
        res.json(allEnquiries);
    } catch (error) {
        throw new Error(error);
    }
});

const getaEnquiry = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const enquiry = await Enquiry.findById(id);
        res.json(enquiry);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createEnquiry,
    getallEnquiries,
    getaEnquiry,
    updateEnquiry,
    deleteEnquiry
}