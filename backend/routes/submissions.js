const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const auth = require('../middleware/auth');

// POST student submits answer
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ error: 'Forbidden' });
  const { assignmentId, answer } = req.body;
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment || assignment.status !== 'Published' || new Date() > assignment.dueDate)
    return res.status(400).json({ error: 'Cannot submit' });
  const existing = await Submission.findOne({ assignmentId, studentId: req.user._id });
  if (existing) return res.status(400).json({ error: 'Already submitted' });
  const submission = new Submission({ assignmentId, studentId: req.user._id, answer });
  await submission.save();
  res.json(submission);
});

// GET teacher views all submissions for an assignment
router.get('/:assignmentId', auth, async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ error: 'Forbidden' });
  const submissions = await Submission.find({ assignmentId: req.params.assignmentId }).populate('studentId', 'name');
  res.json(submissions);
});

// PUT mark submission as reviewed
router.put('/:id/review', auth, async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ error: 'Forbidden' });
  const submission = await Submission.findById(req.params.id);
  submission.reviewed = true;
  await submission.save();
  res.json(submission);
});

module.exports = router;