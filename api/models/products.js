let mongoose = require('mongoose');

// product Schema
const ProductSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    price: {type: Number, required: true},
    sellerid: {type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true},
    productImage: {type: String, required: true}
})

module.exports = mongoose.model('Product', ProductSchema)