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
  fsm.dispatch('create');
  console.log(`Order is now in '${fsm.state}' state`);

  tempOrder.status = fsm.state;
  const order = new Order(tempOrder);
  try {
    const savedOrder = await order.save();
    console.log('SavedOrder:', savedOrder.id);
    res.json(savedOrder);
    setTimeout(() => {
      fsm.dispatch('pay', [savedOrder]);
    }, 5000);
  } catch (e) {
    res.json({ message: e });
  }
});

//Deliver Order
router.put('/deliver', async (req, res) => {
  const order = req.body;
  fsm.transition('DELIVERED');
  try {
    const deliveredOrder = await Order.findOne({ _id: order._id });
    deliveredOrder.status = fsm.state;
    await deliveredOrder.save();
    res.json(deliveredOrder);
  } catch (e) {
    res.json({ message: e });
  }
});

//Confirm Order
router.put('/confirm', async (req, res) => {
  const order = req.body;
  fsm.transition('CONFIRMED');
  try {
    const confirmedOrder = await Order.findOne({ _id: order._id });
    confirmedOrder.status = fsm.state;
    await confirmedOrder.save();
    console.log('Confirmed order:', confirmedOrder);
    res.json(confirmedOrder);
    setTimeout(async () => {
      const getOrder = await Order.findOne({ _id: order._id });
      if (getOrder.status !== 'CANCELLED') {
        fsm.state = getOrder.status;
        fsm.dispatch('deliver', [confirmedOrder]);
      }
    }, 15000);
  } catch (e) {
    res.json({ message: e });
  }
});

//Cancel Order
router.put('/cancel', async (req, res) => {
  const order = req.body;
  fsm.transition('CANCELLED');
  try {
    const cancelledOrder = await Order.findOne({ _id: order._id });
    cancelledOrder.status = fsm.state;
    await cancelledOrder.save();
    res.json(cancelledOrder);
  } catch (e) {
    res.json({ message: e });
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
