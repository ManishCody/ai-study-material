const mongoose = require('mongoose');

const AdvertisementSchema = new mongoose.Schema({
  image: { type: String, required: true },
  text: { type: String, required: true, maxlength: 500 },
  addedBy: { type: String, ref: 'User', required: true },
  displayUntil: { type: Date },
  advLabel: { type: [String] },
}, { timestamps: true });


module.exports = mongoose.models.Advertisement || mongoose.model('Advertisement', AdvertisementSchema);