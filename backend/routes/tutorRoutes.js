const express = require('express');
const router = express.Router();
const tutorController = require('../controllers/tutorController');
const authMiddleware = require('../middleware/authMiddleware');
const tutorMiddleware = require('../middleware/tutorMiddleware');

router.use(authMiddleware, tutorMiddleware);

// Students routes
router.get('/students', tutorController.getAllStudentsWithPoints);
router.post('/students', tutorController.createStudent);
router.put('/students/:id', tutorController.updateStudent);
router.delete('/students/:id', tutorController.deleteStudent);
router.post('/students/:id/reset-password', tutorController.resetStudentPassword);

// Categories routes
router.get('/categories', tutorController.getAllCategories);
router.post('/categories', tutorController.createCategory);
router.put('/categories/:id', tutorController.updateCategory);
router.delete('/categories/:id', tutorController.deleteCategory);

module.exports = router;
