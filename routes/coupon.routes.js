const express =require("express");
const { createCoupon, 
        getAllCounpons, 
        updateCoupon, 
        getAcounpon,
        deleteCoupon
} = require("../controller/coupon.ctrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCoupon);
router.get("/", getAllCounpons);
router.get("/:id", getAcounpon);
router.patch("/:id", authMiddleware, isAdmin, updateCoupon);
router.delete("/:id", authMiddleware, isAdmin, deleteCoupon);
module.exports = router;