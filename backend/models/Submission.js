const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  answer: String,
  submittedAt: { type: Date, default: Date.now },
  reviewed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Submission', SubmissionSchema);