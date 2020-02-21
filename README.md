## Setel POC

This is a POC project for Setel Technical Assessment.

## Requirements before running the project

- DB configuration is handled through the DB_CONNECTION input in the `.env` file. Make sure you to provide the MongoDB connection string accordingly in the file.

## Available Scripts

In each of the project directory (order and payment), you can run:

### `yarn start`
This will start the server on the respective PORT.
- Order [http://localhost:2222](http://localhost:2222)
- Payment [http://localhost:3333](http://localhost:3333)

## APIs

### Create Order

- POST [http://localhost:2222/order](http://localhost:2222/order)
  - ***Req body(optional)***: 
  ```
  {
    "price": "{optional}", 
    "currency": "{optional}"
  }
  ```

### Cancel Order

- PUT [http://localhost:2222/order/cancel](http://localhost:2222/order)
  - ***Req body (required)***: 
  ```
  {
    "_id": "{required}"
  }
  ```

### Check Order Details

- GET [http://localhost:2222/order/:id](http://localhost:2222/order/{orderId})

## Some business logic assumption

- Payment is triggered by the Order app after 5 seconds upon order creation.
- CONFIRMED order can be cancelled within 15 seconds. After 15 seconds, CONFIRMED order will trigger delivery.


