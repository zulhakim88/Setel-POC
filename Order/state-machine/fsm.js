const fetch = require('node-fetch');

const config = require('../config');

const machine = {
  state: 'INIT',
  transitions: {
    INIT: {
      create: function() {
        console.log('Order Created');
        this.transition('CREATED');
      },
    },
    CREATED: {
      pay: function(order) {
        console.log('Payment endpoint:', config.paymentApi);
        fetch(config.paymentApi, {
          method: 'POST',
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          headers: {
            'Content-Type': 'application/json',
            authorization:
              'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzY1Njg3OTgsInVzZXJfbmFtZSI6Inp1bEBhY2NvcmRpdW0uY29tIiwiYXV0aG9yaXRpZXMiOlsiYmFzZV9mZWF0dXJlIiwidmlkZW9fY3JlYXRlIiwidmlkZW9fZGVsZXRlIiwiY29udHJhY3RfcmVhZCIsImNvbnRyYWN0X2RlbGV0ZSIsImNvbnRyYWN0X2NyZWF0ZSIsInZpZGVvX3JlYWQiLCJjb250cmFjdF91cGRhdGUiLCJ2aWRlb191cGRhdGUiXSwianRpIjoiNmQ3N2ZiNWUtYWExOS00OTY5LWIyMjUtZGFiNGI1ZTRlMDQwIiwiY2xpZW50X2lkIjoiYWNjb3JkaXVtIiwic2NvcGUiOlsiYmFyIiwicmVhZCIsIndyaXRlIl19.NbaX7OtHSIPCjI8XO9qftkAEv5UJaSi_lPsd9IdN40R9oq_zEyK3JFg6sliJPSgA6_j0lukUQYId-lt6jBQ2j-KUB_X_S3Dvq_9LEOmktDfzta87KqugTZuoQymKC3WDkojlpUZwDbAjEvt02LwNVnCAgahe-CYo01q-XV3Dv7yDwa2auHs78cxTenSD05WpjWKPWIeIqLhC37EiDXs2XkFynwEw4inp2c0GFnZKYIBh9r5ndfQ95hSLjjXBb_3lqQUh0qTEYWWbWs0lBoACyxihGrgZwTzO9dhWiPA4sfs7znU20KzUT7l70pqIGRxk6BXqIh2xuq3MZdZ7qkwtlA',
          },
          body: JSON.stringify(order),
        })
          .then(res => res.json())
          .then(function(data) {
            if (data.message === 'accept') {
              fetch(`${config.selfApi}/confirm`, {
                method: 'PUT',
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                  'Content-Type': 'application/json',
                  // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify(order),
              })
                .then(res => res.json())
                .then(order => console.log(order));
            } else {
              fetch(`${config.selfApi}/cancel`, {
                method: 'PUT',
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                headers: {
                  'Content-Type': 'application/json',
                  // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify(order),
              }).then(res => res.json());
            }
          })
          .catch(function(err) {
            console.log(err);
            // handle the error here
          });
      },
      cancel: function() {
        console.log('Order will be cancel');
      },
    },
    CONFIRMED: {
      deliver: function(order) {
        console.log('Item out for delivery');
        fetch(`${config.selfApi}/deliver`, {
          method: 'PUT',
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify(order),
        }).then(res => res.json());
      },
    },
    CANCELLED: {},
    DELIVERED: {},
  },
  dispatch(actionName, ...payload) {
    const action = this.transitions[this.state][actionName];
    if (action) {
      action.apply(machine, ...payload);
    } else {
      console.log('Action is invalid');
    }
  },
  transition(newState) {
    this.state = newState;
  },
};

module.exports = machine;
