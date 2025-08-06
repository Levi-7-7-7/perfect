const express = require('express');
const router = express.Router();
const tutorController = require('../controllers/tutorController');
const authMiddleware = require('../middleware/authMiddleware');
const tutorMiddleware = require('../middleware/tutorMiddleware');

router.use(authMiddleware, tutorMiddleware);

// Students routes:
router.get('/students', tutorController.getAllStudentsWithPoints);
// TODO: add POST /students, PUT /students/:id, DELETE /students/:id

// Categories routes:
router.post('/categories', tutorController.createCategory);
// TODO: add other category CRUD routes

module.exports = router;
