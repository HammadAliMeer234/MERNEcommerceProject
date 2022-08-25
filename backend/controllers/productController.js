const Product = require('../Models/productModel');
const ApiFeatures = require('../utils/apiFeatures');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const cloudinary = require('cloudinary')



// Create Product -- Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {

    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    const imagesLink = [];

    for (let i = 0; i < images.length; i++) {

        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products"
        })

        imagesLink.push({
            public_id: result.public_id,
            url: result.secure_url
        })

    }

    req.body.images = imagesLink
    req.body.user = req.user.id

    const product = await Product.create(req.body)

    res.status(201).json({
        success: true,
        product
    })
});


// Get All Products 
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
    const resultPerPage = 8
    let productsCount = await Product.countDocuments()

    const apiFeatures = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()


    let products = await apiFeatures.query
    let fiteredProductsCount = products.length

    apiFeatures.pagination(resultPerPage);

    products = await apiFeatures.query.clone()

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        fiteredProductsCount
    })
});

// Get All Products (ADmin)
exports.getAdminProducts = catchAsyncErrors(async (req, res) => {
    const products = await Product.find()

    res.status(200).json({
        success: true,
        products,
    })
});

// Get Product Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id)

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404))
    }

    res.status(200).json({
        success: true,
        product
    })
});

// Update Product
exports.updateProduct = catchAsyncErrors(async (req, res) => {

    let product = await Product.findById(req.params.id)

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404))
    }

    let images = [];

    if (typeof req.body.images === "string") {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    if (images !== undefined) {
        //Deleting Images From Coudinary
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }

        const imagesLink = [];

        for (let i = 0; i < images.length; i++) {

            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products"
            })

            imagesLink.push({
                public_id: result.public_id,
                url: result.secure_url
            })

        }

        req.body.images = imagesLink
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body,
        {
            new: true,
            runValidators: true,
            useFindAndMOdify: false
        })

    res.status(200).json({
        success: true,
        product
    })
});

exports.deleteProduct = catchAsyncErrors(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404))
    }

    //Deleting Images From Coudinary

    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    await product.remove()

    res.status(200).json({
        success: true,
    })
});

// Create New Review and Update review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    console.log(rating);

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment

    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find((rev) => {
        return rev.user.toString() === req.user._id.toString();
    })

    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString()) {
                rev.rating = rating;
                rev.comment = comment;
            }
        })
    }
    else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach((rev) => {
        avg += rev.rating
    })

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true
    })
})

//Get all review
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404))
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })


})

//delete review
exports.deleteProductReview = catchAsyncErrors(async (req, res, next) => {


    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404))
    }

    const reviews = product.reviews.filter((rev) => {
        return rev._id.toString() !== req.query.reviewId.toString();
    });

    let avg = 0;

    reviews.forEach((rev) => {
        avg += rev.rating
    })

    let ratings = 0;
    if (reviews.length === 0) {
        ratings = 0
    } else {
        ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            ratings,
            numOfReviews
        },
        {
            new: true,
            runValidators: true,
            useFindAndMOdify: false
        }
    )

    res.status(200).json({
        success: true,
        message: "Review delete successfully",
    });


})
