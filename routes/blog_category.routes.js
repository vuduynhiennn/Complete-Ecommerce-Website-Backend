const express = require("express");
const router = express.Router();

const { createbCategory, 
        getallbcategories, 
        getabcategory, 
        updatebCategory,
        deletebCategory
} = require("../controller/blog_category.ctrl");

const { authMiddleware, 
        isAdmin 
} = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, isAdmin, createbCategory);
router.get("/", getallbcategories);
router.get("/:id", getabcategory);
router.patch("/:id", authMiddleware, isAdmin,updatebCategory);
router.delete("/:id", authMiddleware, isAdmin, deletebCategory)

module.exports = router;