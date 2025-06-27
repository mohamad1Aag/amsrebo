import React, { useState } from "react";
import Cart from "./Cart";
import "./Cart.css";


const ProductList = () => {
  const [cartItems, setCartItems] = useState([]);

  

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter((item, index) => index !== productId));
  };

  return (
    <div className="shop-container">
    
      

      <Cart cartItems={cartItems} removeFromCart={removeFromCart} />
    </div>
  );
};

export default ProductList;
