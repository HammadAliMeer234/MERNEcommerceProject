const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const User = require('../Models/userModel');
const sendToken = require('../utils/sendToken');
const sendEmail = require('../utils/sendEmail.js');
const crypto = require('crypto');
const cloudinary = require('cloudinary');


//Register a User
module.exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
    })

    const { name, email, password } = req.body


    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    })
    sendToken(user, 201, res)

})


//Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {

    const { email, password } = req.body

    // chacking if user has givin email or password both

    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email or Password", 400))
    }

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return next(new ErrorHandler("Invalid Login Details", 401))
    }

    const isPasswordMatch = await user.comparePassword(password)

    if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid Login Details", 400))
    }

    sendToken(user, 200, res)
})


//Logged Out
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "Logged Out"
    })
})

//Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return next(new ErrorHandler("User Not Found", 404))
    }

    const resetToken = await user.getResetPasswordToken()

    await user.save({ validateBeforeSave: false })

    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email,  Please Ignore It`

    try {
        await sendEmail({
            email: user.email,
            subject: "Ecommerce Password Recovery",
            message,

        })
        res.status(200).json({
            success: true,
            message: `Email send to ${user.email} succesfully`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resedPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false })

        return next(new ErrorHandler(error.message, 500))

    }

})

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {

    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resedPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler("Reset password token is invalid or has been expired", 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not matched", 400))
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resedPasswordExpire = undefined

    await user.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true
    })



})

//Get User Details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    });
})

//Update Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatch = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatch) {
        return next(new ErrorHandler("Old Password is not match", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));

    }
    user.password = req.body.newPassword;

    await user.save()

    sendToken(user, 200, res)
})

//Update Password
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);

        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId)

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        })

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }


    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndMOdify: false

    })

    res.status(200).json({
        success: true
    })

})

//Get All Users -- Admin
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {

    const users = await User.find()

    res.status(200).json({
        success: true,
        users
    })
})

//Get Single Users -- Admin
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new ErrorHandler(`User Does Not exist with Id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user
    })
})


//Update User Role -- Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    };

    let user = await User.findById(req.params.id)

    if (!user) {
        return next(ErrorHandler(`User does not exist with Id: ${req.params.id}`, 404));
    }


    user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
    });

    res.status(200).json({
        success: true
    });

})

//Update User Role -- Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User Does Not exist with Id: ${req.params.id}`));
    }

    await cloudinary.v2.uploader.destroy(user.avatar.public_id)


    await user.remove();

    res.status(200).json({
        success: true,
        message: "User Deleted Succesfully"
    });

})