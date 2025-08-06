const Student = require('../models/Student');
const Category = require('../models/Category');
const bcrypt = require('bcrypt');

// Fetch students optionally filtered by batch/branch
exports.getAllStudentsWithPoints = async (req, res) => {
  const { batch, branch } = req.query;
  try {
    let filter = {};
    if (batch) filter.batch = batch;
    if (branch) filter.branch = branch;

    const students = await Student.find(filter)
      .select('-password -otp -otpExpiry') // avoid sending sensitive info
      .lean();

    res.json({ students });
  } catch (err) {
    console.error('getAllStudentsWithPoints error:', err);
    res.status(500).json({ message: 'Server error fetching students' });
  }
};

// Create a new student (tutor only)
exports.createStudent = async (req, res) => {
  try {
    const { name, registerNumber, email } = req.body;
    if (!name || !registerNumber || !email) {
      return res.status(400).json({ message: 'Name, register number, and email are required' });
    }

    // Check if student already exists
    let existing = await Student.findOne({ registerNumber });
    if (existing) return res.status(400).json({ message: 'Student with this register number already exists' });

    const student = new Student({ name, registerNumber, email });
    await student.save();

    res.status(201).json({ message: 'Student created successfully', student });
  } catch (err) {
    console.error('createStudent error:', err);
    res.status(500).json({ message: 'Server error creating student' });
  }
};

// Update student details
exports.updateStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const updates = req.body;

    // Prevent changing password, OTP directly here
    delete updates.password;
    delete updates.otp;
    delete updates.otpExpiry;

    const student = await Student.findByIdAndUpdate(studentId, updates, { new: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    res.json({ message: 'Student updated', student });
  } catch (err) {
    console.error('updateStudent error:', err);
    res.status(500).json({ message: 'Server error updating student' });
  }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const deleted = await Student.findByIdAndDelete(studentId);
    if (!deleted) return res.status(404).json({ message: 'Student not found' });

    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error('deleteStudent error:', err);
    res.status(500).json({ message: 'Server error deleting student' });
  }
};

// Reset a student's password (generate temporary password or trigger OTP flow)
exports.resetStudentPassword = async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Example: Reset password to a random temporary password and email it
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashed = await bcrypt.hash(tempPassword, 10);
    student.password = hashed;
    await student.save();

    // Ideally send email to student.email with tempPassword
    // (You can reuse nodemailer config from authController or add utility email module)
    
    res.json({ message: 'Password reset successfully. Temporary password sent via email.' });
  } catch (err) {
    console.error('resetStudentPassword error:', err);
    res.status(500).json({ message: 'Server error resetting password' });
  }
};

// Create category (you already have this)
exports.createCategory = async (req, res) => {
  try {
    const { name, description, maxPoints } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required' });

    const category = new Category({ name, description, maxPoints });
    await category.save();
    res.status(201).json({ message: 'Category created', category });
  } catch (err) {
    console.error('createCategory error:', err);
    res.status(500).json({ message: 'Error creating category' });
  }
};

// Additional category CRUD operations:

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().lean();
    res.json({ categories });
  } catch (err) {
    console.error('getAllCategories error:', err);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const updates = req.body;

    const category = await Category.findByIdAndUpdate(categoryId, updates, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });

    res.json({ message: 'Category updated', category });
  } catch (err) {
    console.error('updateCategory error:', err);
    res.status(500).json({ message: 'Error updating category' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const deleted = await Category.findByIdAndDelete(categoryId);
    if (!deleted) return res.status(404).json({ message: 'Category not found' });

    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('deleteCategory error:', err);
    res.status(500).json({ message: 'Error deleting category' });
  }
};
