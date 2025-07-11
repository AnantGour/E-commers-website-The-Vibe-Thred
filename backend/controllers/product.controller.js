import Product from '../models/product.model.js';
import Category from '../models/category.model.js';

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
// CREATE PRODUCT - Admin Only
export const createProduct = async (req, res) => {
  const { name, description, price, category, countInStock } = req.body; // Changed 'title' to 'name' for consistency with frontend formData.name
  const productImage = req.files?.productImage; // Expecting 'productImage' from frontend FormData

  if (!name || !description || !price || !category || !productImage || !countInStock) { // Added countInStock to check
    return res.status(400).json({ message: 'All fields including image are required' });
  }

  try {
    // --- File Upload Logic ---
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    // Adjust this path based on your actual backend project structure
    // This assumes your public folder is something like:
    // backend-project/public/uploads/productimages
    const uploadDir = path.join(__dirname, '../../frontend/public/uploads/productimages');

    
    // Ensure the directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uniqueFilename = `${Date.now()}-${productImage.name}`;
    const fullUploadPath = path.join(uploadDir, uniqueFilename);

    await productImage.mv(fullUploadPath);

    // Store the relative path or just the filename in the database
    // Assuming your frontend will fetch images from /uploads/productimages/filename
    const imagePathForDB = `/uploads/productimages/${uniqueFilename}`;

    const newProduct = new Product({ 
      name, // Using 'name' for consistency with frontend
      description, 
      price, 
      category, 
      image: imagePathForDB, // Storing the path
      countInStock 
    });
    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating product:', err); // Log the actual error for debugging
    res.status(500).json({ message: 'Failed to create product', error: err.message });
  }
};



// GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
  try {
    const { category, sort } = req.query;

    let query = {};

    if (category) {
      const categoryDoc = await Category.findOne({ name: { $regex: new RegExp(`^${category}$`, 'i') } });
      if (!categoryDoc) {
        return res.status(404).json({ message: `Category '${category}' not found` });
      }

      query.category = categoryDoc._id; // ✅ Filter by ObjectId
    }

    let sortOption = {};
    if (sort === 'price-asc') sortOption.price = 1;
    else if (sort === 'price-desc') sortOption.price = -1;
    else if (sort === 'newest') sortOption.createdAt = -1;

    const products = await Product.find(query).sort(sortOption).limit(20);

    res.json(products);
  } catch (err) {
    console.error('❌ Error fetching products:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// SEARCH PRODUCTS
export const searchProducts = async (req, res) => {
  try {
    const query = req.query.query;

    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const results = await Product.find({
      title: { $regex: query, $options: 'i' }
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
};

// GET PRODUCT BY ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET CATEGORIES
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getRandomProducts = async (req, res) => {
  try {
    const { category, limit = 4 } = req.query;

    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    const categoryDoc = await Category.findOne({ name: { $regex: new RegExp(`^${category}$`, 'i') } });
    if (!categoryDoc) {
      return res.status(404).json({ message: `Category '${category}' not found` });
    }

    const products = await Product.aggregate([
      { $match: { category: categoryDoc._id } },
      { $sample: { size: parseInt(limit) } }
    ]);

    res.status(200).json(products);
  } catch (error) {
    console.error('❌ Error fetching random products:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};