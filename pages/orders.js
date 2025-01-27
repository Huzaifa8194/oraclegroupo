"use client";

import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../src/firebaseConfig";
import PageBanner from "../src/components/PageBanner";
import Layout from "../src/layouts/Layout";
import { FaClipboardList, FaChevronDown, FaChevronUp } from "react-icons/fa";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openComments, setOpenComments] = useState({}); // Keeps track of which comments are open

  // Fetch orders for the logged-in user
  useEffect(() => {
    const fetchOrders = async (email) => {
      try {
        const ordersRef = collection(db, "Orders");
        const q = query(ordersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map((doc) => doc.data());
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchOrders(currentUser.email);
      } else {
        setUser(null);
        setOrders([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleComment = (index) => {
    setOpenComments((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle the visibility of comments for a specific order
    }));
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

  return (
    <Layout header={4}>
      <PageBanner pageName={"My Orders"} />
      <section className="orders-section pt-100 pb-100 mt-70 mb-70">
        <div className="container">

            <h2>Track your orders.</h2>
            <p>All your orders will be displayed here along with their statuses when updated by us.</p>
          {orders.length > 0 ? (
            <div className="orders-table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Placed On</th>
                    <th>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td className="order-id">{order.sessionId || "N/A"}</td>
                        <td className="order-items">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="order-item">
                              {item.name} <strong>x{item.quantity}</strong>
                            </div>
                          )) || "N/A"}
                        </td>
                        <td className="order-total">
                          ${order.amount_total?.toFixed(2) || "N/A"}
                        </td>
                        <td className="order-status">
                          <span
                            className={`order-status-badge ${
                              order.status === "Done" ? "status-complete" : "status-pending"
                            }`}
                          >
                            {order.status || "N/A"}
                          </span>
                        </td>
                        <td className="order-date">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="order-comments">
                          <button
                            className="comments-toggle-btn"
                            onClick={() => toggleComment(index)}
                          >
                            {openComments[index] ? (
                              <>
                                Hide Comments <FaChevronUp />
                              </>
                            ) : (
                              <>
                                View Comments <FaChevronDown />
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                      {openComments[index] && (
                        <tr className="comments-row">
                          <td colSpan="6" className="comments-cell">
                            {order.comment ? (
                              <p>{order.comment}</p>
                            ) : (
                              <p>No comments available for this order.</p>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="orders-empty">
              <FaClipboardList className="orders-empty-icon" />
              <h3>No orders found</h3>
              <p>Your past orders will appear here once placed.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Orders;
