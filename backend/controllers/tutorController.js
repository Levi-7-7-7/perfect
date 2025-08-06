const Student = require('../models/Student');
const Category = require('../models/Category');

// Fetch students optionally filtered by batch/branch
exports.getAllStudentsWithPoints = async (req, res) => {
  const { batch, branch } = req.query;
  try {
    let filter = {};
    if (batch) filter.batch = batch;
    if (branch) filter.branch = branch;

    const students = await Student.find(filter)
      .select('-password -otp -otpExpiry')
      .lean();

    // Here you can also populate or compute points if you want

    res.json({ students });
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching students' });
  }
};

// TODO: add createStudent, updateStudent, deleteStudent controllers per your requirements

// CRUD for categories similarly
exports.createCategory = async (req, res) => {
  try {
    const { name, description, maxPoints } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required' });

    const category = new Category({ name, description, maxPoints });
    await category.save();
    res.status(201).json({ message: 'Category created', category });
  } catch (err) {
    res.status(500).json({ message: 'Error creating category' });
  }
};
