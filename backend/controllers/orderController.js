const Product = require('../Models/productModel');
const Order = require('../Models/orderModel')
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');

//Create New Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    });

    res.status(201).json({
        success: true,
        order
    });
});

//Get All orders
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email")

    if (!order) {
        return next(new ErrorHandler("Product Not Found With This Id", 404))
    }

    res.status(200).json({
        success: true,
        order
    });
});

// Get loggedm in user Orders 
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        orders
    });
});

// Get All Orders -- Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    });
});

//Update Order Status -- Admin
exports.updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Product Not Found With This Id", 404))
    }

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("You have already delivered order", 404));
    }

    if (req.body.status === "Shipped") {
        order.orderItems.forEach(async (order) => {
            await updateStoke(order.product, order.quantity);
        });
    }

    order.orderStatus = req.body.status;

    if (req.body.orderStatus === "Delivered") {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true
    });
});

async function updateStoke(id, quantity) {
    const product = await Product.findById(id);

    product.stock -= quantity;

    await product.save({ validateBeforeSave: false })
}

// Delete Order -- Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if (!order) {
        return next(new ErrorHandler("Product Not Found With This Id", 404))
    }

    await order.remove()

    res.status(200).json({
        success: true,
        message: "Order Deleted Successfully"

    });
});