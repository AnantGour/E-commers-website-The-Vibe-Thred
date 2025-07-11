import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountPercent: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
});

export default mongoose.model('Coupon', couponSchema);
