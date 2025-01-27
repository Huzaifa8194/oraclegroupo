"use client";

import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../src/firebaseConfig";
import PageBanner from "../src/components/PageBanner";
import Layout from "../src/layouts/Layout";
import { FaTrash, FaCartPlus, FaTruck } from "react-icons/fa";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user and cart data
  useEffect(() => {
    const fetchCart = async (userId) => {
      try {
        const userDoc = await getDoc(doc(db, "Users", userId));
        if (userDoc.exists()) {
          const { cart } = userDoc.data();
          setCartItems(cart || []);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchCart(currentUser.uid);
      } else {
        setUser(null);
        setCartItems([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Update cart item quantity
  const updateQuantity = async (index, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCartItems = [...cartItems];
    updatedCartItems[index].quantity = newQuantity;

    setCartItems(updatedCartItems);

    try {
      const userRef = doc(db, "Users", user.uid);
      await updateDoc(userRef, { cart: updatedCartItems });
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  // Remove item from cart
  const removeItem = async (index) => {
    const updatedCartItems = cartItems.filter((_, i) => i !== index);

    setCartItems(updatedCartItems);

    try {
      const userRef = doc(db, "Users", user.uid);
      await updateDoc(userRef, { cart: updatedCartItems });
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingFee = subtotal > 0 ? 50 : 0;
  const total = subtotal + shippingFee;

  if (loading) {
    return <p>Loading cart...</p>;
  }

  return (
    <Layout header = {4}>
      <PageBanner pageName={"Cart"} />
      <section className="cart-section pt-100 pb-100 mt-70 mb-70">
        <div className="container">
          {cartItems.length > 0 ? (
            <>
              <div className="cart-table-wrapper">
                <table className="cart-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Subtotal</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item, index) => (
                      <tr key={index}>
                        <td className="product-info">
                          <img src={item.imageUrl} alt={item.name} className="product-image" />
                          <span className="product-name">{item.name}</span>
                        </td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>
                          <div className="quantity-control">
                            <button
                              className="quantity-btn"
                              onClick={() => updateQuantity(index, item.quantity - 1)}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                              className="quantity-input"
                            />
                            <button
                              className="quantity-btn"
                              onClick={() => updateQuantity(index, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td>${(item.price * item.quantity).toFixed(2)}</td>
                        <td>
                          <button
                            className="remove-btn"
                            onClick={() => removeItem(index)}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="cart-totals">
                <h4>Cart Totals</h4>
                <ul>
                  <li>
                    <span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span>
                  </li>
                  <li>
                    <span>Shipping Fee:</span> <span>${shippingFee.toFixed(2)}</span>
                  </li>
                  <li className="total">
                    <span>Total:</span> <span>${total.toFixed(2)}</span>
                  </li>
                </ul>
                <button className="checkout-btn">Proceed to Checkout</button>
              </div>
            </>
          ) : (
            <div className="empty-cart">
              <FaCartPlus className="empty-cart-icon" />
              <h3>Your cart is empty</h3>
              <p>Start adding items to your cart to see them here.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Cart;
