const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  date: {
    type: Date,
    default: Date.now(),
  },
  price: {
    type: Number,
    default: 0.0,
  },
  currency: {
    type: String,
    default: 'MYR',
  },
  status: {
    type: String,
    default: 'INIT',
  },
});

module.exports = mongoose.model('Order', orderSchema);
