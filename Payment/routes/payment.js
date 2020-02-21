const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  console.log(req.body);
  console.log('Header bearer token:', req.get('authorization'));
  const output = ['accept', 'decline', 'accept', 'decline', 'accept'];
  res.json({ message: output[Math.floor(Math.random() * output.length)] });
});

module.exports = router;
