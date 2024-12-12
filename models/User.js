const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 225 },
  email: { type: String, required: true, maxlength: 224 },
  creditScore: { type: Number, default: 0 },
  isMember: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
