// backend/routes/categoryRoutes.js
const express = require('express');
const router = express.Router();

// You can add real category handlers when ready
router.get('/', (req, res) => {
  res.json({ message: "Category route works!" });
});

module.exports = router;
