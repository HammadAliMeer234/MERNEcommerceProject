const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const path = require('path')

const errorMiddleware = require('./middleware/error')

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require('dotenv').dotenv.config({ path: 'backend/config/config.env' });
}

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())

//Route imports
const productRoute = require('./route/productRoute');
const userRoute = require('./route/userRoute')
const orderRoute = require('./route/orderRoute')
const PaymentRoute = require('./route/paymentRoute')


app.use('/api/v1', productRoute);
app.use('/api/v1', userRoute);
app.use('/api/v1', orderRoute);
app.use('/api/v1', PaymentRoute);

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
});

//MIddleware For Errors
app.use(errorMiddleware);

module.exports = app;