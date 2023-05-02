const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require("bcrypt");
const crypto = require("crypto")
// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
   title: {
    type: String,
    required: true
   },
   description: {
    type: String,
    required: true
   },
   category: {
    type: String,
    required: true
   },
   numViews: {
    type: Number,
    default: 0
   },
   isLiked: {
    type: Boolean,
    default: false
   },
   isDisliked: {
    type: Boolean,
    default: false
   },
   dislikes:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
   }],
   likes:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
   }],
   image: {
    type: String,
    default: "https://thumbs.dreamstime.com/b/blog-information-website-concept-workplace-background-text-view-above-127465079.jpg"
   },
   images: [ ]
   ,
   author: {
    type: String,
    default: "admin"
   }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);