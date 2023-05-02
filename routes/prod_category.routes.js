const express = require("express");
const router = express.Router();

const { createCategory, 
        getallcategories, 
        getacategory, 
        updateCategory,
        deleteCategory
} = require("../controller/prod_category.ctrl");

const { authMiddleware, 
        isAdmin 
} = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, isAdmin, createCategory);
router.get("/", getallcategories);
router.get("/:id", getacategory);
router.patch("/:id", authMiddleware, isAdmin,updateCategory);
router.delete("/:id", authMiddleware, isAdmin, deleteCategory)

module.exports = router;