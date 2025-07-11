import Coupon from '../models/coupon.model.js';

export const createCoupon = async (req, res) => {
  const { code, discountPercent, expiryDate } = req.body;
  try {
    const newCoupon = new Coupon({ code, discountPercent, expiryDate });
    await newCoupon.save();
    res.status(201).json(newCoupon);
  } catch (err) {
    res.status(500).json({ message: 'Coupon creation failed', error: err.message });
  }
};

export const applyCoupon = async (req, res) => {
  const { code } = req.body;
  const coupon = await Coupon.findOne({ code });

  if (!coupon || coupon.expiryDate < new Date()) {
    return res.status(400).json({ message: 'Invalid or expired coupon' });
  }

  res.json({ discountPercent: coupon.discountPercent });
};
