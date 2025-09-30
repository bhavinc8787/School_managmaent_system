const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const auth = require('../middleware/auth');

// GET assignments (filtered by role)
router.get('/', auth, async (req, res) => {
  const { role, _id } = req.user;
  let filter = {};
  if (role === 'student') filter.status = 'Published';
  if (role === 'teacher') filter.createdBy = _id;
  const assignments = await Assignment.find(filter).sort('-createdAt');
  res.json(assignments);
});

// POST create assignment (teacher only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ error: 'Forbidden' });
  const { title, description, dueDate } = req.body;
  const assignment = new Assignment({ title, description, dueDate, createdBy: req.user._id });
  await assignment.save();
  res.json(assignment);
});

// PUT edit assignment (only in Draft)
router.put('/:id', auth, async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);
  if (assignment.status !== 'Draft' || assignment.createdBy.toString() !== req.user._id.toString())
    return res.status(403).json({ error: 'Cannot edit' });
  Object.assign(assignment, req.body);
  await assignment.save();
  res.json(assignment);
});

// DELETE assignment (only in Draft)
router.delete('/:id', auth, async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);
  if (assignment.status !== 'Draft' || assignment.createdBy.toString() !== req.user._id.toString())
    return res.status(403).json({ error: 'Cannot delete' });
  await assignment.remove();
  res.json({ success: true });
});

// PUT update status (teacher only)
router.put('/:id/status', auth, async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ error: 'Forbidden' });
  const assignment = await Assignment.findById(req.params.id);
  assignment.status = req.body.status;
  await assignment.save();
  res.json(assignment);
});

module.exports = router;