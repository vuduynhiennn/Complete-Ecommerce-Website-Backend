
const express = require("express");
const router = express.Router();
const { createProduct, 
        getaproduct, 
        getallproducts,
        updateProduct,
        deleteaproduct,
        addToWishlist,
        rating,
        uploadImages
} = require("../controller/product.ctrl");

const { isAdmin,
        authMiddleware 
} = require("../middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImages");

router.post('/', authMiddleware, isAdmin ,createProduct);
router.put('/upload/:id', authMiddleware, isAdmin, uploadPhoto.array('images', 10), productImgResize, uploadImages);
router.delete('/:id',  authMiddleware, isAdmin, deleteaproduct);
router.post("/wishlist", authMiddleware, addToWishlist);
router.post("/rating", authMiddleware, rating);
router.get('/:id', getaproduct);
router.put('/:id',  authMiddleware, isAdmin, updateProduct);
router.get('/', getallproducts);

module.exports = router