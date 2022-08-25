const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require('jsonwebtoken');
const User = require("../Models/userModel");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {

    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("Please Login to access this resaurce", 401));
    }

    const decodeData = jwt.verify(token, process.env.SECRET_KEY);

    req.user = await User.findById(decodeData.id);

    next()
});

exports.authorizeRoles = (...roles) => {

    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role: ${req.user.role} is not allowed to access this resaurce`,
                    403
                )
            )
        }
        next()
    }
}