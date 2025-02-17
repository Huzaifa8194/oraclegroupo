import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../src/firebaseConfig";
import Layout from "../src/layouts/Layout";

const Success = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { sessionId } = router.query; // PayPal payment ID

  useEffect(() => {
    const fetchOrder = async () => {
      if (!sessionId) {
        setError("Missing session ID.");
        setLoading(false);
        return;
      }

      try {
        // Retrieve order from Firestore
        const orderRef = doc(db, "Orders", sessionId);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          setOrder(orderSnap.data());
        } else {
          setError("Order not found.");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to retrieve order details.");
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchOrder();
    }
  }, [sessionId]);

  return (
    <Layout header={4} footer>
      <div
        className="success-page-wrapper"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
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
            <p style={{ fontSize: "1.2em", fontWeight: "bold", color: "#007bff" }}>
              Loading order details...
            </p>
          )}

          {error && (
            <p style={{ fontSize: "1.2em", fontWeight: "bold", color: "#dc3545" }}>
              {error}
            </p>
          )}

          {!loading && !error && order && (
            <div>
              <h2 style={{ color: "#28a745", marginBottom: "20px" }}>Thank You!</h2>
              <p style={{ fontSize: "1.1em", color: "#6c757d", lineHeight: "1.5" }}>
                Your order has been successfully placed.
              </p>

              {/* Order Summary */}
              <h4 style={{ marginTop: "20px", color: "#007bff" }}>Order Summary</h4>
              <p><strong>Order ID:</strong> {order.sessionId}</p>
              <p><strong>Total Amount:</strong> ${order.amount_total}</p>
              <p><strong>Status:</strong> {order.status}</p>

              {/* Billing Details */}
              <h4 style={{ marginTop: "20px", color: "#007bff" }}>Billing Details</h4>
              <p><strong>Name:</strong> {order.billingDetails.firstName} {order.billingDetails.lastName}</p>
              <p><strong>Email:</strong> {order.billingDetails.email}</p>
              <p><strong>Phone:</strong> {order.billingDetails.phone}</p>
              <p><strong>Address:</strong> {order.billingDetails.address}, {order.billingDetails.city}, {order.billingDetails.zip}</p>

              {/* Purchased Items */}
              <h4 style={{ marginTop: "20px", color: "#007bff" }}>Items Purchased</h4>
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {order.items.map((item, index) => (
                  <li key={index} style={{ marginBottom: "5px" }}>
                    {item.name} - {item.quantity} x ${item.price}
                  </li>
                ))}
              </ul>

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
