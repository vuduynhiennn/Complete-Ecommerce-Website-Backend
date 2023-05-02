const express = require("express");
const router = express.Router();

const { createColor, 
        getallColors, 
        getaColor, 
        updateColor,
        deleteColor
} = require("../controller/color.ctrl");

const { authMiddleware, 
        isAdmin 
} = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, isAdmin, createColor);
router.get("/", getallColors);
router.get("/:id", getaColor);
router.patch("/:id", authMiddleware, isAdmin, updateColor);
router.delete("/:id", authMiddleware, isAdmin, deleteColor)

module.exports = router;