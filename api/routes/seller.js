const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const multer = require('multer')
const checkAuth = require('../auth/auth')

const upload_rules = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './product_images/')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname)
    }
})

const image_filter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)
    }else{
        cb(null, false)
    }
}

const upload = multer({
    storage: upload_rules,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    image_filter: image_filter
})

const ProductController = require('../controllers/products')
const OrdersController = require('../controllers/orders')

router.post('/create-catalog', checkAuth, upload.single('productImage'), ProductController.add_product)

router.get('/orders/:id', checkAuth, OrdersController.get_single_order)

module.exports = router