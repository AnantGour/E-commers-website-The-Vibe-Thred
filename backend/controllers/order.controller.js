import Order from '../models/order.model.js';

// 📦 Place New Order
export const placeOrder = async (req, res) => {
  try {
    console.log("📥 Received Order Body:", req.body); // ✅
    console.log("👤 Decoded User:", req.user); // ✅

    const { products, address, paymentMethod, totalAmount } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: Missing user in request' });
    }

    const newOrder = new Order({
      user: req.user.id,
      products,
      address,
      paymentMethod,
      totalAmount,
    });

    const savedOrder = await newOrder.save();
    console.log("✅ Order saved:", savedOrder); // ✅

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('❌ Order creation failed:', err);
    res.status(500).json({ message: 'Order creation failed', error: err.message });
  }
};


export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate({
        path: 'products.product',
        model: 'Product',
        select: 'name image price'
      });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get user orders', error: err.message });
  }
};


// 🛒 Get All Orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('products.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get all orders', error: err.message });
  }
};

// ✅ Mark Order as Delivered (Admin)
export const markAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.isDelivered = true;
    order.deliveredAt = new Date();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark as delivered', error: err.message });
  }
};

// 💳 Mark Order as Paid (Admin)
export const markAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.isPaid = true;
    order.paidAt = new Date();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark as paid', error: err.message });
  }
};
export const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.isCancelled = true;
    order.cancelReason = reason;
    await order.save();

    res.json({ message: 'Order cancelled' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to cancel order', error: err.message });
  }
};
export const getMonthlySales = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          totalSales: { $sum: '$totalAmount' }
        }
      },
      {
        $project: {
          month: '$_id',
          totalSales: 1,
          _id: 0
        }
      },
      { $sort: { month: 1 } }
    ]);
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get sales data', error: err.message });
  }
};
