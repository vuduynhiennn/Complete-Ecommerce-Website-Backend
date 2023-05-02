const express = require("express");
const router = express.Router();

const { createBrand, 
        getallbrands, 
        getaBrand, 
        updateBrand,
        deleteBrand
} = require("../controller/brand.ctrl");

const { authMiddleware, 
        isAdmin 
} = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, isAdmin, createBrand);
router.get("/", getallbrands);
router.get("/:id", getaBrand);
router.patch("/:id", authMiddleware, isAdmin, updateBrand);
router.delete("/:id", authMiddleware, isAdmin, deleteBrand)

module.exports = router;