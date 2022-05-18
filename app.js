const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

app.use((err, req, res, next) =>{
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")

    if(req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET")
        return res.status(200).json({})
    }
    next()
})

const auth_routes = require('./api/routes/auth')
const buyer_routes = require('./api/routes/buyer')
const seller_routes = require('./api/routes/seller')

mongoose.connect('mongodb+srv://simple-shop:'+ process.env.MONGO_PASS +'@cluster0.sehv8.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

app.use(morgan('dev'))
app.use('/product_images', express.static('product_images'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/api/auth', auth_routes)
app.use('/api/buyer', buyer_routes)
app.use('/api/seller', seller_routes)

app.use((req, res, next) => {
    const err = new Error('Route not found')
    err.status = 404
    next(err)
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json({
        error: {
            message: err.message
        }
    })
})

module.exports = app