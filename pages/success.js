import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, setDoc, collection, updateDoc } from "firebase/firestore";
import { db } from "../src/firebaseConfig";

import Layout from "../src/layouts/Layout";
import { getAuth } from "firebase/auth"; // To get the authenticated user's ID

const Success = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const saveOrder = async () => {
      const { session_id } = router.query;
      const auth = getAuth();
      const user = auth.currentUser;
  
      if (!session_id || !user) {
        setError("No session ID provided or user not authenticated.");
        setLoading(false);
        return;
      }
  
      try {
        const response = await fetch(`/api/verify-session?session_id=${session_id}`);
        const { session, lineItems } = await response.json();
  
        if (!session || session.payment_status !== "paid") {
          setError("Payment not successful.");
          setLoading(false);
          return;
        }
  
        const billingDetails = session.metadata;
  
        const orderRef = doc(collection(db, "Orders"));
        await setDoc(orderRef, {
          sessionId: session.id,
          email: session.customer_email,
          amount_total: session.amount_total / 100,
          items: lineItems.map((item) => ({
            name: item.description,
            quantity: item.quantity,
            price: item.price.unit_amount / 100,
          })),
          billingDetails, // Save billing details
          createdAt: new Date().toISOString(),
        });
  
        const userRef = doc(db, "Users", user.uid);
        await updateDoc(userRef, { cart: [] });
  
        setLoading(false);
      } catch (error) {
        console.error("Error verifying session or saving order:", error);
        setError("Failed to process your order.");
        setLoading(false);
      }
    };
  
    saveOrder();
  }, [router.query]);
  

  return (
    <Layout header={4} footer>
      <div
        className="success-page-wrapper"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh", // Adjusted for header and footer space
          padding: "20px",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div
          className="success-content"
          style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            maxWidth: "600px",
            textAlign: "center",
          }}
        >
          {loading && (
            <p
              style={{
                fontSize: "1.2em",
                fontWeight: "bold",
                color: "#007bff",
              }}
            >
              Processing your order...
            </p>
          )}
          {error && (
            <p
              style={{
                fontSize: "1.2em",
                fontWeight: "bold",
                color: "#dc3545",
              }}
            >
              Error: {error}
            </p>
          )}
          {!loading && !error && (
            <div>
              <h2 style={{ color: "#28a745", marginBottom: "20px" }}>
                Thank you!
              </h2>
              <p
                style={{
                  fontSize: "1.1em",
                  color: "#6c757d",
                  lineHeight: "1.5",
                }}
              >
                Your order has been placed successfully. Your cart has been
                cleared. We’ve sent a confirmation email to your inbox. If you
                have any questions, feel free to contact us.
              </p>
              <button
                className="main-btn bordered-btn mt-4"
                style={{
                  padding: "10px 20px",
                  fontSize: "1em",
                  border: "2px solid #007bff",
                  borderRadius: "5px",
                  backgroundColor: "#fff",
                  color: "#007bff",
                  cursor: "pointer",
                }}
                onClick={() => router.push("/")}
              >
                Go Back to Homepage
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Success;
