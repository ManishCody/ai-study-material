const PaymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    paymentMethod: { type: String, enum: ['Credit Card', 'PayPal', 'UPI', 'Net Banking'], required: true },
    status: { type: String, default: 'Completed' },
  }, { timestamps: true });
  
  module.exports = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);