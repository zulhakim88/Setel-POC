## Setel POC

This is a POC project for Setel Technical Assessment.

## Available Scripts

In each of the project directory (order and payment), you can run:

### `yarn start`
This will start the server on the respective PORT.
- Order [http://localhost:2222](http://localhost:2222)
- Payment [http://localhost:3333](http://localhost:3333)

## APIs

### Create Order

- POST [http://localhost:2222/order](http://localhost:2222/order)

### Cancel Order

- PUT [http://localhost:2222/order/cancel](http://localhost:2222/order)

### Check Order Details

- GET [http://localhost:2222/order/cancel/:id](http://localhost:2222/order/{orderId})

## Some business logic assumption

- Payment is triggered by the Order app after 5 seconds
- CONFIRMED order can be cancelled within 15 seconds. After 15 seconds, CONFIRMED order will trigger delivery.


