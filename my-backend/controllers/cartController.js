const Cart = require('../models/Cart');

exports.addToCart = async (req, res) => {
  const { userId, productId, adminId } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // لما تنشئ السلة لأول مرة، ضيف adminId مع المنتج
      cart = new Cart({ userId, products: [{ productId, adminId, quantity: 1 }] });
    } else {
      // لو السلة موجودة، ابحث عن المنتج
      const item = cart.products.find(p => p.productId.toString() === productId);
      if (item) {
        item.quantity += 1; // زيد الكمية لو موجود
      } else {
        // لو المنتج غير موجود أضفه مع adminId
        cart.products.push({ productId, adminId, quantity: 1 });
      }
    }

    const savedCart = await cart.save();
    res.json(savedCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate('products.productId').populate('products.adminId');
    if (!cart) return res.status(404).json({ message: 'السلة فارغة' });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
