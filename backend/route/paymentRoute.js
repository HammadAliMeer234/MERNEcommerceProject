const express = require('express')
const router = express.Router()

const { processPayment, sendStripeApiKay } = require('../controllers/paymentController')
const { isAuthenticatedUser } = require('../middleware/auth')


router.route('/payment/process').post(isAuthenticatedUser, processPayment)

router.route('/stripeapikey').get(isAuthenticatedUser, sendStripeApiKay)


module.exports = router