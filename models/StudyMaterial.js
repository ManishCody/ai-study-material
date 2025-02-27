const mongoose = require('mongoose');

const StudyMaterialSchema = new mongoose.Schema({
  courseId: { type: String, required: true, maxlength: 224 },
  courseType: { type: String, required: true, maxlength: 224 },
  topic: { type: String, required: true, maxlength: 224 },
  difficultyLevel: { type: String, default: 'Easy', maxlength: 224 },
  Complete: { type: Number, default: 0, min: 0, max: 100 },
  courseLayout: {
    chapters: [
      {
        chapterTitle: { type: String, required: true },
        isComplete: { type: Boolean, default: false },
        topics: [
          {
            title: { type: String },
            htmlContent: {
              summary: { type: String }, // HTML formatted summary
              keyPoints: { type: [String] }, // Array of HTML formatted key points
            },
          },
        ],
      },
    ],
  },
  course_summary: { type: String },
  createdBy: { type: String, required: true, maxlength: 224 },
  topicImage: {
    type: String,
    default: 'https://i.postimg.cc/158Hpvj6/vector-design-online-learn-study-260nw-2428847413-removebg-preview.png',
  },
  status: { type: String, default: 'Pending', maxlength: 224 },
  notes: { type: Boolean, default: false },
  flashcards: {
    exists: { type: Boolean, default: false },
    data: { type: Array, default: [] },
    isComplete: { type: Boolean, default: false }
  },
  quizs: {
    exists: { type: Boolean, default: false },
    data: { type: Array, default: [] },
    isComplete: { type: Boolean, default: false }
  },
  questions: {
    exists: { type: Boolean, default: false },
    data: { type: Array, default: [] },
    isComplete: { type: Boolean, default: false }
  },
  courseLabel : { type: String , default:'ALL' },
}, { timestamps: true });

module.exports =
  mongoose.models.StudyMaterial || mongoose.model('StudyMaterial', StudyMaterialSchema);
