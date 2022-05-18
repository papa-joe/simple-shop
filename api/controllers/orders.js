let Order = require('../models/orders')
let User = require('../models/user')
const mongoose = require('mongoose')

exports.get_all_orders = (req, res, next) => {
    Order.find({})
        .select('_id quantity productid')
        .populate('productid', 'name')
        .exec((err, data) => {
            if (!err) {
                if (data.length > 0) {
                    res.status(201).json({
                        status: "success",
                        message: "All orders fetched",
                        count: data.length,
                        orders: data.map(o => {
                            return {
                                _id: o._id,
                                products: o.productid,
                                seller: o.sellerid
                            }
                        })
                    })
                } else {
                    res.status(201).json({
                        status: "success",
                        message: 'There are no orders in the database'
                    })
                }
            } else {
                res.status(500).json({
                    status: "failed",
                    error: err
                })
            }
        });
}

exports.make_order = (req, res, next) => {
    User.findById(req.params.seller_id, (err, data) => {
        if (!data || data.account_type !== "Seller") {
            res.status(401).json({
                status: "failed",
                message: "Invalid entryt"
            })
        } else {
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                productid: req.body.productid,
                sellerid: req.params.seller_id
            })

            order.save((err, data) => {
                if (!err) {
                    res.status(201).json({
                        status: "success",
                        message: 'Order added successfully',
                        order: data
                    })
                } else {
                    res.status(500).json({
                        status: "failed",
                        error: err
                    })
                }
            })
        }
    })
}

exports.get_single_order = (req, res, next) => {
    Order.find({ sellerid: req.params.id })
        .populate('productid')
        .exec((err, data) => {
            if (!err) {
                if (data.length < 1) {
                    return res.status(401).json({
                        status: "failed",
                        message: "No orders to show"
                    })
                }

                res.status(201).json({
                    status: "success",
                    message: "All sellers orders fetched",
                    count: data.length,
                    sellers: data.map(s => {
                        return {
                            orderid: s._id,
                            products: s.productid.map(p => {
                                return {
                                    prod: p
                                }
                            })
                        }
                    })
                })
            } else {
                res.status(500).json({
                    status: "failed",
                    error: err
                })
            }
        })
}