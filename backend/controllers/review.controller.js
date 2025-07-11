import Review from '../models/review.model.js';
import Product from '../models/product.model.js';

export const createReview = async (req, res) => {
    const { productId, rating, description } = req.body;
    const userId = req.user.id;
  
    try {
      const existing = await Review.findOne({ user: userId, product: productId });
      if (existing) {
        return res.status(400).json({ message: 'You already reviewed this product' });
      }
  
      const review = new Review({ user: userId, product: productId, rating, description });
      await review.save();
  
      const reviews = await Review.find({ product: productId });
      const avgRating =
        reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  
      await Product.findByIdAndUpdate(productId, { averageRating: avgRating });
  
      res.status(201).json({ message: 'Review added successfully' });
    } catch (err) {
      console.error('Add review error:', err);
      res.status(500).json({ message: 'Failed to add review' });
    }
  };
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};
