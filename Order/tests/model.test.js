const Order = require('../models/order');

describe('Model Test', () => {
  it('Should create and order object', () => {
    const order1 = new Order();
    expect(order1).toBeDefined();
  });
  it('Should not create 2 of the same object', () => {
    const order1 = new Order();
    const order2 = new Order();
    expect(order1._id).not.toEqual(order2._id);
  });
});
