const express = require("express");
const router = express.Router();

const { createUser, 
        loginUserCtrl, 
        getallusers, 
        getauser, 
        deleteauser, 
        updateauser, 
        blockUser, 
        unblockUser, 
        handleRefreshToken,
        logout,
        updatePassword,
        fotgotPasswordToken,
        resetPassword,
        loginAdmin,
        getWishList,
        saveAddress,
        userCart,
        getUserCart,
        emptyCart,
        applyCoupon,
        createOrder,
        getOrder,
        updateOrderStatus
} = require("../controller/user.ctrl.js");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware.js");
router.post('/register', createUser);
router.post('/forgot-password-token', fotgotPasswordToken);
router.post('/reset-password/:token', resetPassword);
router.put('/order/update-order/:id', authMiddleware, isAdmin, updateOrderStatus);
router.put('/password', authMiddleware, updatePassword);
router.post('/login', loginUserCtrl);
router.post('/admin-login', loginAdmin);
router.get('/all-users', getallusers);
router.get('/get-orders', authMiddleware, getOrder);
router.get('/refresh', handleRefreshToken);
router.put('/logout', logout);
router.get("/wishlist", authMiddleware, getWishList);
router.post('/cart/applycoupon', authMiddleware, applyCoupon);
router.post('/cart', authMiddleware, userCart);
router.get('/cart', authMiddleware, getUserCart);
router.post('/cart/cash-order', authMiddleware, createOrder);
router.delete('/empty-cart', authMiddleware, emptyCart);
router.get('/:id', authMiddleware, isAdmin, getauser); 
router.delete('/:id', deleteauser);
router.put('/save-address', authMiddleware, saveAddress);  
router.put('/edit-user', authMiddleware, updateauser);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);

module.exports = router