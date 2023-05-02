const express = require("express");
const router = express.Router();

const { createEnquiry, 
        getallEnquirys, 
        getaEnquiry, 
        updateEnquiry,
        deleteEnquiry,
        getallEnquiries
} = require("../controller/enq.ctrl");

const { authMiddleware, 
        isAdmin 
} = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, isAdmin, createEnquiry);
router.get("/", getallEnquiries);
router.get("/:id", getaEnquiry);
router.patch("/:id", authMiddleware, isAdmin, updateEnquiry);
router.delete("/:id", authMiddleware, isAdmin, deleteEnquiry)

module.exports = router;