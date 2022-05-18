let Product = require('../models/products')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

exports.add_product = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_KEY)

    if (decoded.account_type === "Seller") {
        const product = new Product({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            price: req.body.price,
            sellerid: decoded.userid,
            productImage: req.file.path
        })

        product.save((err, data) => {
            if (!err) {
                res.status(201).json({
                    status: "success",
                    message: 'Product added successfully',
                    product: data
                })
            } else {
                res.status(500).json({
                    status: "failed",
                    error: err
                })
            }
        })
    } else {
        res.status(201).json({
            status: "failed",
            message: 'Create a seller account to start adding products'
        })
    }
}

exports.edit_product = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_KEY)

    Product.findById(req.params.id, (err, data) => {
        if (!err) {
            if (data.sellerid == decoded.userid) {
                const updateOps = {}
                for (const ops of req.body) {
                    updateOps[ops.propName] = ops.value
                }
                Product.findByIdAndUpdate(req.params.id, { $set: updateOps }, { new: true }, (err, data) => {
                    if (!err) {
                        if (data !== null) {
                            res.status(200).json({
                                status: "success",
                                message: 'Product Updated Successfully',
                                product: data
                            })
                        } else {
                            res.status(200).json({
                                status: "failed",
                                message: 'Product not found'
                            })
                        }

                    } else {
                        res.status(500).json({
                            status: "failed",
                            error: err
                        })
                    }
                });
            } else {
                res.status(404).json({
                    status: "failed",
                    message: 'Unauthorized'
                })
            }

        } else {
            res.status(500).json({
                status: "failed",
                error: err
            })
        }
    })
}

exports.delete_product = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_KEY)

    Product.findById(req.params.id, (err, data) => {
        if (!err) {
            if (data && data.sellerid == decoded.userid) {
                Product.findByIdAndRemove(req.params.id, (err, data) => {
                    if (!err) {
                        res.status(200).json({
                            status: "success",
                            message: 'product deleted'
                        })
                    } else {
                        res.status(500).json({
                            status: "failed",
                            error: err
                        })
                    }
                });
            } else {
                res.status(404).json({
                    status: "failed",
                    message: 'No product was found'
                })
            }
        } else {
            res.status(500).json({
                status: "failed",
                error: err
            })
        }
    })
}

exports.get_seller_product = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_KEY)

    if (decoded.account_type === "Buyer") {
        Product.find({ sellerid: req.params.seller_id }, (err, data) => {
            if (!err) {
                if (data.length < 1) {
                    return res.status(401).json({
                        status: "failed",
                        message: "No products to showrer"
                    })
                }
    
                res.status(201).json({
                    status: "success",
                    message: "All sellers product fetched",
                    count: data.length,
                    sellers_products: data.map(p => {
                        return {
                            name: p.name,
                            price: p.price
                        }
                    })
                })
    
            } else {
                res.status(500).json({
                    status: "failed",
                    error: err
                })
            }
        });
    }else {
        res.status(201).json({
            status: "failed",
            message: 'Log into your buyer account to view sellers catalog'
        })
    }
    
}