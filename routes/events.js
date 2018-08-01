const express = require('express');
const router = express.Router();

/* GET auth page. */

router.get('/', (req, res, next) => {
  res.json({ code: 'not-found' });
});

module.exports = router;
