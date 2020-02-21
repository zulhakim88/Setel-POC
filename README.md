## Setel POC

This is a POC project for Setel Technical Assessment.

## Requirements for running the project locally

- DB configuration is handled through the DB_CONNECTION define in the `.env` file located in the root of the Order project. Make sure that you provide the MongoDB connection string accordingly in the file.

- IP needs to be whitelisted when using MongoDB Atlas. So it's either you will have to provide your own MongoDB details or I will have to whitelist your public IP upon request.

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

- GET [http://localhost:2222/order/{orderId}](http://localhost:2222/order/{orderId})

## Some business logic assumption

- Payment is triggered by the Order app after 5 seconds upon order creation.
- CONFIRMED order can be cancelled within 15 seconds. After 15 seconds, CONFIRMED order will trigger delivery.


