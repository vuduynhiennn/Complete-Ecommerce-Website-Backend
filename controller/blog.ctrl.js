const Blog = require("../models/blog.models");
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId.js");
const cloudinaryUploadImg = require("../utils/cloudinary");
const fs = require("fs");

const createBlog = asyncHandler(async(req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json({
            newBlog,
        })
    } catch (error) {
        throw new Error(error);
    }
}); 

const updateBlog = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updateBlog);
    } catch (error) {
        throw new Error(error);
    }
});

const getablog = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);

    try {
        const getablog = await Blog.findById(id).populate("likes").populate("dislikes");                                                                                    
        await Blog.findByIdAndUpdate(
            id, 
            {
                $inc: { numViews: 1},
            },
            {
                new: true
            }
        )
        res.json(getablog);
    } catch (error) {
        throw new Error(error);
    }
});

const getallblogs = asyncHandler(async(req, res) => {
    
    try {
        const allblogs = await Blog.find();
        res.json(allblogs);
    } catch (error) {
        throw new Error(error)
    };
});

const deleteablog = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(blogId);
    try {
        const deleteablog = await Blog.findByIdAndDelete(id);
        res.json(deleteablog);
    } catch (error) {
        throw new Error(error);
    }
});

const disliketheblog = asyncHandler(async(req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);
    // find the blog which you want to be liked
    const blog = await Blog.findById(blogId);
    //find the login user
    const loginUserId = req?.user?._id;

    // find if the user has liked the blog
    const isDisliked = blog?.isDisliked;
    //find if the use if user disliked the blog
    const alreadyLiked = blog?.likes?.find((userId) => userId?.toString() === loginUserId?.toString());
    if (alreadyLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId},
            isLiked: false
        }, {
            new: true
        })
        res.json(blog);
    };
    if (isDisliked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId},
            isDisliked: false
        }, {
            new: true
        })
        res.json(blog);
    } else {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: { dislikes: loginUserId},
            isDisliked: true
        }, {
            new: true
        })
        res.json(blog);
    }

})
const likeBlog = asyncHandler(async(req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);
    // find the blog which you want to be liked
    const blog = await Blog.findById(blogId);
    //find the login user
    const loginUserId = req?.user?._id;

    // find if the user has liked the blog
    const isLiked = blog?.isLiked;
    //find if the use if user disliked the blog
    const alreadyLiked = blog?.dislikes?.find((userId) => userId?.toString() === loginUserId?.toString());

    if (alreadyLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId},
            isDisliked: false
        }, {
            new: true
        })
        res.json(blog);
    };
    if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes : loginUserId},
            isLiked: false
        }, {
            new: true
        })
        res.json(blog);
    } else {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: { likes: loginUserId}, 
            isLiked: true
        }, {
            new: true
        })
        res.json(blog);
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
        const findBlog = await Blog.findByIdAndUpdate(id, {
            images: urls.map(file => {
                return file;
            }, { new: true}),
        });
        res.json(findBlog);
    } catch (error) {
        throw new Error(error);
    }
});


module.exports = {
    createBlog,
    updateBlog,
    getablog,
    getallblogs,
    deleteablog,
    likeBlog,
    disliketheblog,
    uploadImages
}