import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  price: Number,
  countInStock: Number,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  averageRating: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;