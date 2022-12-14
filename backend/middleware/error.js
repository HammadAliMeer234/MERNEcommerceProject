const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    //Cast rrror
    if (err.name === "CastError") {
        const message = `Resaurce Not Found. Invalid ${err.path}`
        err = new ErrorHandler(message, 400)
    }

    //Mongoose duplicate key rrror
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(message, 400)
    }

    //Wrong JWT rrror
    if (err.name === "JsonWebTokenError") {
        const message = `Json Web Token is invalid, Try again`
        err = new ErrorHandler(message, 400)
    }

    //JWT Expire error
    if (err.name === "TokenExpireError") {
        const message = `Json Web Token is Expire, Try again`
        err = new ErrorHandler(message, 400)
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}