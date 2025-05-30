const Cart = require('../models/Cart');

exports.addToCart = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products: [{ productId }] });
    } else {
      const item = cart.products.find(p => p.productId == productId);
      if (item) {
        item.quantity += 1;
      } else {
        cart.products.push({ productId });
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
    const cart = await Cart.findOne({ userId: req.params.userId }).populate('products.productId');
    if (!cart) return res.status(404).json({ message: 'السلة فارغة' });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
