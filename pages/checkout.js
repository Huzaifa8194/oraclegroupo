"use client";

import React, { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../src/firebaseConfig";
import PageBanner from "../src/components/PageBanner";
import Layout from "../src/layouts/Layout";
import { loadStripe } from "@stripe/stripe-js";
import { FaCreditCard, FaBitcoin, FaShippingFast, FaDollarSign } from "react-icons/fa";
import { toast } from "react-toastify";

const Checkout = () => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

  // Fetch user and cart data
  useEffect(() => {
    const fetchCart = async (userId) => {
      try {
        const userDoc = await getDoc(doc(db, "Users", userId));
        if (userDoc.exists()) {
          const { cart } = userDoc.data();
          setCartItems(cart || []);
          const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
          setSubtotal(total);
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

  // Handle Stripe Checkout
  const handleCheckout = async () => {
    if (!user) {
      toast.info("Please log in to proceed with checkout.");
      return;
    }
  
    const stripe = await stripePromise;
  
    // Gather billing details from form inputs
    const billingDetails = {
      firstName: document.querySelector('input[placeholder="First Name"]').value,
      lastName: document.querySelector('input[placeholder="Last Name"]').value,
      email: document.querySelector('input[placeholder="Email Address"]').value,
      phone: document.querySelector('input[placeholder="Phone Number"]').value,
      address: document.querySelector('input[placeholder="Address"]').value,
      city: document.querySelector('input[placeholder="City"]').value,
      zip: document.querySelector('input[placeholder="ZIP Code"]').value,
    };
  
    const response = await fetch("/api/stripe-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItems, email: user.email, billingDetails }),
    });
  
    const session = await response.json();
    if (session.id) {
      await stripe.redirectToCheckout({ sessionId: session.id });
    } else {
      toast.info("Failed to initiate checkout. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading checkout details...</p>;
  }

  return (
    <Layout header={4}>
      <PageBanner pageName={"Checkout"} />
      <section className="checkout-section pt-100 pb-80">
        <div className="container">
          {/* Billing Details */}
          <div className="billing-details">
            <h4 className="section-title">Billing Details</h4>
            <form className="billing-form">
              <div className="row">
                <div className="col-lg-6">
                  <input type="text" placeholder="First Name" className="form_control" />
                </div>
                <div className="col-lg-6">
                  <input type="text" placeholder="Last Name" className="form_control" />
                </div>
                <div className="col-lg-6">
                  <input type="email" placeholder="Email Address" className="form_control" />
                </div>
                <div className="col-lg-6">
                  <input type="text" placeholder="Phone Number" className="form_control" />
                </div>
                <div className="col-lg-12">
                  <input type="text" placeholder="Address" className="form_control" />
                </div>
                <div className="col-lg-6">
                  <input type="text" placeholder="City" className="form_control" />
                </div>
                <div className="col-lg-6">
                  <input type="text" placeholder="ZIP Code" className="form_control" />
                </div>
              </div>
            </form>
          </div>

          <div className="row mt-50">
            {/* Order Summary */}
            <div className="col-lg-6">
              <h4 className="section-title">Order Summary</h4>
              <div className="order-summary-wrapper">
                <ul className="order-summary">
                  {cartItems.map((item, index) => (
                    <li key={index} className="order-item">
                      <span>{item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                  <li className="order-item">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </li>
                  <li className="order-item">
                    <span>Shipping Fee</span>
                    <span>$50</span>
                  </li>
                  <li className="order-item total">
                    <span>Total</span>
                    <span>${(subtotal + 50).toFixed(2)}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Payment Section */}
            <div className="col-lg-6">
              <h4 className="section-title">Payment Method</h4>
              <Accordion>
                <div className="payment-method">
                  <Accordion.Toggle as="label" eventKey="1">
                    <FaCreditCard style={{ marginRight: "10px" }} />
                    Credit/Debit Card
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="1">
                    <p>Pay securely using your credit or debit card through Stripe.</p>
                  </Accordion.Collapse>
                </div>
                <div className="payment-method">
                  <Accordion.Toggle as="label" eventKey="2">
                    <FaBitcoin style={{ marginRight: "10px", color: "#F7931A" }} />
                    Cryptocurrency
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="2">
                    <p>Pay securely using cryptocurrency through Stripe.</p>
                  </Accordion.Collapse>
                </div>
              </Accordion>
              <button onClick={handleCheckout} className="main-btn btn-yellow mt-20">
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;
