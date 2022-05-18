const express = require('express')
const router = express.Router();
const checkAuth = require('../auth/auth')

const ProductController = require('../controllers/products')
const OrdersController = require('../controllers/orders')
const UserController = require('../controllers/users')

router.get('/list-of-sellers', checkAuth, UserController.get_sellers)

router.get('/seller-catalog/:seller_id', ProductController.get_seller_product)

router.post('/create-order/:seller_id', checkAuth, OrdersController.make_order)

module.exports = router