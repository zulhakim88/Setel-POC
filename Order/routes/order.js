const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const fsm = require('../state-machine/fsm');

//Create Order
router.post('/', async (req, res) => {
  console.log('Body', req.body);

  const tempOrder = {
    price: req.body.price,
    currency: req.body.currency,
  };
  fsm.state = 'INIT';
  console.log('FSM state:', fsm.state);
  const tempObj = Object.create(fsm);
  tempObj.dispatch('create');
  console.log(`Order is now in '${tempObj.state}' state`);

  tempOrder.status = tempObj.state;

  const order = new Order(tempOrder);

  try {
    const savedOrder = await order.save();
    console.log('SavedOrder:', savedOrder.id);
    res.json(savedOrder._id);
    setTimeout(() => {
      tempObj.dispatch('pay', [savedOrder]);
    }, 5000);
  } catch (e) {
    res.json({ message: e });
  }
});

//Deliver Order
router.put('/deliver', async (req, res) => {
  const order = req.body;
  try {
    const deliveredOrder = await Order.findOne({ _id: order._id }, async (err, doc) => {
      console.log('Order for delivery:', doc);
      doc.status = 'DELIVERED';
      await doc.save();
    });
    res.json(deliveredOrder);
  } catch (e) {
    console.log(e);
  }
});

//Confirm Order
router.put('/confirm', async (req, res) => {
  const order = req.body;
  try {
    await Order.findOne({ _id: order._id }, async (err, doc) => {
      console.log('Order for confirmation:', doc);
      doc.status = 'CONFIRMED';
      await doc.save();
    });
    const confirmedOrder = await Order.findOne({ _id: order._id });
    confirmedOrder.status = 'CONFIRMED';
    fsm.state = 'CONFIRMED';
    const tempObj = Object.create(fsm);
    res.json(confirmedOrder);
    setTimeout(async () => {
      const getOrder = await Order.findOne({ _id: order._id });
      if (getOrder.status !== 'CANCELLED') {
        console.log('Order is to be delivered');
        tempObj.dispatch('deliver', [confirmedOrder]);
      }
    }, 15000);
  } catch (e) {
    console.log(e);
  }
});

//Cancel Order
router.put('/cancel', async (req, res) => {
  const order = req.body;
  try {
    const cancelledOrder = await Order.findOne({ _id: order._id }, async (err, doc) => {
      console.log('Order for cancellation:', doc);
      doc.status = 'CANCELLED';
      await doc.save();
    });
    res.json(cancelledOrder);
  } catch (e) {
    console.log(e);
  }
});

//Check order status
router.get('/:id', async (req, res) => {
  const orderId = req.params.id;
  try {
    const fetchOrder = await Order.findOne({ _id: orderId });
    res.json(fetchOrder);
  } catch (e) {
    res.json({ message: e });
  }
});

module.exports = router;
