let mongoose = require('mongoose');

// product Schema
const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    productid: { type: [mongoose.Schema.Types.ObjectId], ref: 'Product', required: true },
    sellerid: {type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true}
})

module.exports = mongoose.model('Order', orderSchema)