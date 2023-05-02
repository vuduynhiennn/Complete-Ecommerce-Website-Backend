const express = require("express");
const router = express.Router();

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { createBlog, 
        updateBlog, 
        getablog, 
        getallblogs, 
        deleteablog, 
        likeBlog,
        disliketheblog,
        uploadImages
} = require("../controller/blog.ctrl");
const { uploadPhoto, blogImgResize } = require("../middlewares/uploadImages");

router.post("/", authMiddleware, isAdmin, createBlog);
router.put("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array("images", 10), blogImgResize, uploadImages);
router.patch("/:id", authMiddleware, isAdmin, updateBlog);
router.get("/:id", getablog);
router.get("/", getallblogs);
router.delete("/:id", authMiddleware, isAdmin, deleteablog);
router.put("/likes", authMiddleware, likeBlog);
router.put("/disklikes", authMiddleware, disliketheblog);

module.exports = router