const mongoose = require('mongoose');

// Schema for Chapter Notes model
const ChapterNotesSchema = new mongoose.Schema({
  chapterId: { type: String, required: true }, // Chapter ID (UUID)
  notes: {
    htmlContent: {
      chapterTitle: { type: String, required: true },
      summary: { type: String, required: true }, // HTML formatted summary
      keyPoints: { type: [String], required: true }, // Array of HTML formatted key points
    },
  },
}, { timestamps: true });

module.exports = mongoose.models.ChapterNotes || mongoose.model('ChapterNotes', ChapterNotesSchema);
