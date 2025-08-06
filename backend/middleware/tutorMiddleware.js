const Tutor = require('../models/Tutor');

module.exports = async (req, res, next) => {
  if (!req.user || req.user.role !== 'tutor') {
    return res.status(403).json({ message: 'Access denied. Tutor role required.' });
  }
  // Optionally verify tutor exists in DB:
  const tutor = await Tutor.findById(req.user.id);
  if (!tutor) {
    return res.status(403).json({ message: 'Tutor not found' });
  }
  next();
};
