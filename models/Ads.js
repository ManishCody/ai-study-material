const AdvertisementSchema = new mongoose.Schema({
    image: { type: String, required: true },
    text: { type: String, required: true, maxlength: 500 },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    displayUntil: { type: Date },
    targetCourse: { type: mongoose.Schema.Types.ObjectId, ref: 'StudyMaterial' },
  }, { timestamps: true });


  module.exports = mongoose.models.Advertisement || mongoose.model('Advertisement', AdvertisementSchema);