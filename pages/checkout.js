"use client";

import React, { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, collection } from "firebase/firestore";
import { db, auth } from "../src/firebaseConfig";
import PageBanner from "../src/components/PageBanner";
import Layout from "../src/layouts/Layout";
import { FaCreditCard, FaBitcoin } from "react-icons/fa";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";

const Checkout = () => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [billingDetails, setBillingDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
  });
  const [isPayPalEnabled, setIsPayPalEnabled] = useState(false);
  const router = useRouter();

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

  // Enable PayPal button only if all billing details are filled
  useEffect(() => {
    const allFieldsFilled = Object.values(billingDetails).every((value) => value.trim() !== "");
    setIsPayPalEnabled(allFieldsFilled);
  }, [billingDetails]);

  // Handle input change
  const handleInputChange = (e) => {
    setBillingDetails({
      ...billingDetails,
      [e.target.name]: e.target.value,
    });
  };

  // Save Order to Firestore and Redirect to Success Page
  const saveOrderToFirestore = async (orderID, details) => {
    if (!user) return;

    try {
      const orderData = {
        sessionId: orderID,
        amount_total: subtotal.toFixed(2),
        billingDetails,
        items: cartItems.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        createdAt: new Date().toISOString(),
        status: "Pending",
        comment: "",
        email: user.email,
        productUrl: window.location.href,
      };

      // Save order to Firestore
      const orderRef = doc(collection(db, "Orders"), orderID);
      await setDoc(orderRef, orderData);

      toast.success("Order saved successfully!");

      // Redirect to success page with order ID
      router.push(`/success?sessionId=${orderID}`);
    } catch (error) {
      console.error("Error saving order:", error);
      toast.error("Failed to save order. Please try again.");
    }
  };

  // Handle PayPal Checkout Success
  const handleApprove = async (orderID, details) => {
    toast.success("Payment Successful!");
    await saveOrderToFirestore(orderID, details);
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
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    className="form_control"
                    value={billingDetails.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-lg-6">
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    className="form_control"
                    value={billingDetails.lastName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-lg-6">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    className="form_control"
                    value={billingDetails.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-lg-6">
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    className="form_control"
                    value={billingDetails.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-lg-12">
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    className="form_control"
                    value={billingDetails.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-lg-6">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    className="form_control"
                    value={billingDetails.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-lg-6">
                  <input
                    type="text"
                    name="zip"
                    placeholder="ZIP Code"
                    className="form_control"
                    value={billingDetails.zip}
                    onChange={handleInputChange}
                  />
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
                </ul>
              </div>
            </div>

            {/* Payment Section */}
            <div className="col-lg-6">
              <h4 className="section-title">Payment Method</h4>
              <Accordion>
                <div className="payment-method">
                  <Accordion.Toggle as="label" eventKey="1">
                    <FaCreditCard style={{ marginRight: "10px", color: "#eece38" }} />
                    <p style={{ display: "inline" }}>Credit/Debit Card</p>
                  </Accordion.Toggle>
                </div>
              </Accordion>

              {/* PayPal Checkout Button */}
              <PayPalScriptProvider options={{ "client-id": "AZmaijO0dacYDckGvCzacwPasNOeNgpvfG5khHmlPjOInKjnrwZimWUAMC4F7jnKdb4SMChqas2EZZl8" }}>
                <div className="mt-20">
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    disabled={!isPayPalEnabled}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [{ amount: { value: subtotal.toFixed(2) } }],
                      });
                    }}
                    onApprove={(data, actions) => {
                      return actions.order.capture().then((details) => {
                        handleApprove(details.id, details);
                      });
                    }}
                  />
                </div>
              </PayPalScriptProvider>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;
