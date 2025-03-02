const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 225 },
  email: { type: String, required: true, maxlength: 224 },
  creditScore: { type: Number, default: 0 },
  isPremium: { type: Boolean, default: false },
  isElite: { type: Boolean, default: false },
  paymentHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }],
  subscriptionStartDate: { type: Date },
  subscriptionEndDate: { type: Date },
  currentPlan: { type: String, enum: ["Free", "Pro", "Premium"], default: "Free" },
  courseLabels: { type: [String], default: [], set: (v) => [...new Set(v)] }
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
