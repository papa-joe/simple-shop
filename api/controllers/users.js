const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

let User = require('../models/user')



exports.register = (req, res, next) => {
    User.find({ email: req.body.email }, (err, data) => {
        if (!err) {
            if (data.length <= 0) {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            status: 'failed',
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            account_type: req.body.account_type
                        })

                        user.save((err, data) => {
                            if (!err) {
                                res.status(201).json({
                                    status: "success",
                                    message: 'User created successfully',
                                    user: data
                                })
                            } else {
                                res.status(500).json({
                                    status: "failed",
                                    message: 'failed to create user',
                                    error: err
                                })
                            }
                        })
                    }
                })
            } else {
                res.status(404).json({
                    status: "failed",
                    message: 'User already exist'
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

exports.login = (req, res, next) => {
    User.find({ email: req.body.email }, (err, data) => {
        if (!err) {
            if (data.length < 1) {
                return res.status(401).json({
                    status: "failed",
                    message: "Unauthenticated"
                })
            }

            bcrypt.compare(req.body.password, data[0].password, (e, r) => {
                if (e) {
                    return res.status(401).json({
                        status: "failed",
                        message: "Unauthenticated"
                    })
                }

                if (r) {

                    const token = jwt.sign(
                        { email: data[0].email, userid: data[0]._id, account_type: data[0].account_type },
                        process.env.JWT_KEY,
                        {expiresIn: '1h'}
                    )

                    return res.status(200).json({
                        status: "success",
                        message: "user login successful",
                        token: token
                    })
                }

                res.status(200).json({
                    status: "failed",
                    message: "Unauthenticated"
                })
            })
        } else {

        }
    })
}

exports.get_sellers = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token, process.env.JWT_KEY)

    if (decoded.account_type === "Buyer") {
        User.find({ account_type: "Seller" }, (err, data) => {
            if (!err) {
                if (data.length < 1) {
                    return res.status(401).json({
                        status: "failed",
                        message: "No sellers to show"
                    })
                }

                res.status(201).json({
                    status: "success",
                    message: "All sellers fetched",
                    count: data.length,
                    sellers: data.map(s => {
                        return {
                            email: s.email
                        }
                    })
                })
            }else{
                res.status(500).json({
                    status: "failed",
                    error: err
                }) 
            }
        })
    }else{
        res.status(200).json({
            status: "failed",
            message: "Unauthenticated"
        })
    }
}