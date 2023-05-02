const generateToken = require("../config/jwtToken");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");
const Coupon = require("../models/coupon.model");
const Order = require("../models/order.model");
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshtoken");
const jwt = require("jsonwebtoken");
const sendEmail = require("./email.ctrl");
const crypto = require("crypto");
const uniqid = require("uniqid");


const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({email});
    if (!findUser) {
        // create a new user
        const newUser = await User.create(req.body);
        return res.json(newUser);
    } else {
        // user already exits
        throw new Error('User already exits')
    }
});

// user login
const loginUserCtrl = asyncHandler(async(req, res) => {
    const { email, password } = req.body;
    // check if user exits or not 
    const findUser = await User.findOne({ email });

    if (findUser && await findUser.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findUser?._id);

        const updateuser = await User.findByIdAndUpdate(findUser?._id, {
            refreshToken: refreshToken
        }, { new: true });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });

        res.json({
            _id: findUser.id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?.id)
        })
    } else {
        throw new Error('Invalid Credentials');
    }
});

// admin login
const loginAdmin = asyncHandler(async(req, res) => {
    const { email, password } = req.body;
    // check if user exits or not 
    const findAdmin = await User.findOne({ email });

    if (findAdmin?.role !== "admin") {
        throw new Error("Not authorised"); 
    };

    if (findAdmin && await findAdmin.isPasswordMatched(password)) {
        const refreshToken = await generateRefreshToken(findAdmin?._id);
        await User.findByIdAndUpdate(findAdmin?._id, {
            refreshToken: refreshToken
        }, { new: true });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });

        res.json({
            _id: findAdmin.id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?.id)
        })
    } else {
        throw new Error('Invalid Credentials');
    }
});

// get all users
const getallusers = asyncHandler(async(req, res) => {
    try {
        const getUsers = await User.find(); 
        return res.json(getUsers);
    } catch (error) {
        throw new Error(error);
    }
});

// get a user
const getauser = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getauser = await User.findById(id)
        res.json({getauser})
    } catch (error) { 
        throw new Error(error)
    }
});

// handler refresh token
const handleRefreshToken = asyncHandler(async(req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error('No refresh token in cookie');
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });

    if (!user) throw new Error('No refresh token present id in db or not match');
    jwt.verify(refreshToken, process.env.JWT_SECRET, ( err, decoded ) => {
        if (err || user.id !== decoded.id) throw new Error("There is something wrong with refresh token");
        const accessToken = generateToken(user?._id); 
        res.json({ accessToken });
    });
    res.json(user);
});

// log out functionality
const logout = asyncHandler(async(req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error('No refresh token in cookies');
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });

    if (!user) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true
        });
        return res.sendStatus(204); // forbidden
    };

    await User.findOneAndUpdate(refreshToken, {
        refreshToken: " ",
    });

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    });

    return res.sendStatus(204); // forbidden
});

// update a user
const updateauser = asyncHandler(async(req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id)
    try {
        const updateauser = await User.findByIdAndUpdate(_id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile
        }, 
        {
            new: true
        });
        res.json(updateauser);

    } catch (error) {
        throw new Error(error);
    }
});

// delete a user
const deleteauser = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteuser = await User.findByIdAndDelete(id)
        res.json({deleteuser})
    } catch (error) { 
        throw new Error(error)
    }
});

// block user
const blockUser = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const block = await User.findByIdAndUpdate(
            id, 
            {
                isBlocked: true
            },
            {
                new: true
            }
        );
        res.json({
            msg: "User blocked"
        });
    } catch (error) {
        throw new Error(error);
    };
});

// unblock user
const unblockUser = asyncHandler(async(req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const unblock = await User.findByIdAndUpdate(
            id, 
            {
                isBlocked: false
            },
            {
                new: true
            }
        );
        res.json({
            msg: "User unblocked"
        })
    } catch (error) {
        throw new Error(error);
    }
});

// update password
const updatePassword = asyncHandler(async(req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        const updatePassword = await user.save();
        res.json(updatePassword);
    }
    res.json(user)
});

// forgot password
const fotgotPasswordToken = asyncHandler(async(req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found with this email');
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURI = `HI, please follow this link to reset your password. This link is valid till 10 minutes from now. <a href="${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/api/user/reset-password/${token}"> Click here </a>`;
        const data = {
            to: email,
            text: "Hey user, ",
            subject: "Forgot Password Link",
            html: resetURI,

        }
        sendEmail(data);
        res.json(token);

    } catch (error) {
        throw new Error(error);
    };
});

// reset password
const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest("hex");
    const user = await User.findOne({ 
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error("Token expired, please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
});

// get wishlist 
const getWishList = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    console.log(_id)
    try {
        const findUser = await User.findById(_id).populate("wishlist");
        res.json(findUser)
    } catch (error) {
        throw new Error(error);
    }
});

// saveAddress
const saveAddress = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const updateauser = await User.findByIdAndUpdate(_id, {
            address: req?.body?.address
        }, 
        {
            new: true
        });
        res.json(updateauser);

    } catch (error) {
        throw new Error(error);
    }
});

const userCart = asyncHandler(async(req, res) => {
    const { cart } = req.body;
    const { _id } = req.user;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    try {
        let products = [];
        // check if user already have product in cart
        const alreadyExitsCart = await Cart.findOne({ orderby: user._id});
        if (alreadyExitsCart) {
            alreadyExitsCart.remove();
        }
        for (let i = 0; i < cart.length; i++) {
            let object = {};
            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;
            let getPrice = await Product.findById(cart[i]._id).select("price").exec();
            object.price = getPrice.price;

            products.push(object);
        };
        let cartTotal = 0;
        for (let i = 0; i < products.length; i++) {
            cartTotal += products[i].price * products[i].count;
        }
        let newCart = await Cart({
            products,
            cartTotal,
            orderedBy: user?._id
        }).save();
        res.json({
           newCart
        });
    } catch (error) {
        throw new Error(error);
    };
}); 

const getUserCart = asyncHandler(async(req, res) => {
    const { _id } = req.user;   
    validateMongoDbId(_id);
    try {
        const cart = await Cart.findOne({ orderedBy: _id});
        res.json(cart)
    } catch (error) {
        throw new Error(error);
    }
});

const emptyCart = asyncHandler(async(req, res) => {
    const { _id } = req.user;   
    console.log(_id);
    validateMongoDbId(_id);
    try {
        const user = await User.findOne({ _id });
        const cart = await Cart.findOneAndRemove({ orderedBy : user._id});
        res.json(cart)
    } catch (error) {
        throw new Error(error);
    }
});

const applyCoupon = asyncHandler(async(req, res) => {
    const { coupon } = req.body;
    const { _id } = req.user;
    const validCoupon = await Coupon.findOne({ name: coupon });
    if (!validCoupon) {
        throw new Error("Invalid coupon");
    }
    const user = await User.findOne({ _id });
    let { products, cartTotal } = await Cart.findOne({ orderedBy: user._id }).populate("products.product");
    let totalAfterDiscount = ( cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2);
    await Cart.findOneAndUpdate( { orderedBy: user._id}, {
        totalAfterDiscount
    }, {
        new: true
    });
    res.json(totalAfterDiscount);
});

const createOrder = asyncHandler(async (req, res) => {
    const { COD, couponApplied } = req.body;    
    const { _id } = req.user; 
    validateMongoDbId(_id);
    try {
        if (!COD) throw new Error('Create cash order failed');
        const user = await User.findById({ _id });
        let userCart = await Cart.findOne({ orderedBy: user._id });
        let finalAmout = 0;
        if (couponApplied && userCart.totalAfterDiscount) {
            finalAmout = userCart.totalAfterDiscount * 100;
        } else {
            finalAmout = userCart.cartTotal * 100;
        };
        let newOrder = await new Order({
            products: userCart.products,
            paymentIntent: {
                id: uniqid(),
                method: "COD",
                amount: finalAmout,
                status: "Cash on Delivery",
                created: Date.now(),
                currency: "usd"
            },
            orderedBy: user._id,
            orderStatus: "Cash on Delivery"
        }).save();
        let update = userCart.products.map((item) => {
            return {
                updateOne: {
                    filter: {_id: item.product_id},
                    update: { $inc: {quantity: -item.count, sold: +item.count}}
                }
            }
        });
        const updated = await Product.bulkWrite(update, {});
        res.json({
            msg: "success",

        });
    } catch (error) {
        throw new Error(error);
    }
});

const getOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const userOrders = await Order.findOne( { orderedBy: _id} ).populate('products.product').exec();
        res.json(userOrders);
    } catch (error) {
        throw new Error(error);
    };
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updateOrderStatus = await Order.findByIdAndUpdate(id, {
            orderStatus: status,
            paymentIntent: {
                status: status
            }
        }, { new: true });
        res.json(updateOrderStatus)
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {
    createUser,
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
}