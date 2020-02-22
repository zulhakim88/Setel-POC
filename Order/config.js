const config = {
  dev: {
    paymentApi: 'https://djcuxscww8.execute-api.ap-southeast-1.amazonaws.com/dev/payment',
    selfApi: 'https://15dw3d499c.execute-api.ap-southeast-1.amazonaws.com/dev/order',
  },
  offline: {
    paymentApi: 'http://localhost:3333/payment',
    selfApi: 'http://localhost:2222/order',
  },
};

module.exports = config[process.env.SERVER_ENV];
