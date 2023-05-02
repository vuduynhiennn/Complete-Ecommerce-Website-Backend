require("dotenv").config();
const mongoose = require("mongoose");

const dbConnect = () => {
    try {
        const conn = mongoose.connect(process.env.MONGO_URL);
        console.log("database is connected");
    } catch (error) {
        console.log("database error");
        throw new Error(error);     
    }   
};

module.exports = dbConnect;