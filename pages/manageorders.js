"use client";

import React, { useEffect, useState } from "react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../src/firebaseConfig";
import Layout from "../src/layouts/Layout";
import PageBanner from "../src/components/PageBanner";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";

import { getDoc } from "firebase/firestore";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("newest");



    const router = useRouter();
    
      useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
          if (!user) {
            router.push("/");
            return;
          }
          
          const userDocRef = doc(db, "Users", user.uid);
          const userDoc = await getDoc(userDocRef);
    
          if (!userDoc.exists() || userDoc.data().role !== "admin") {
            router.push("/");
          }
        });
      }, [router]);
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "Orders", orderId);
      await updateDoc(orderRef, { status: newStatus });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleCommentChange = async (orderId, newComment) => {
    try {
      const orderRef = doc(db, "Orders", orderId);
      await updateDoc(orderRef, { comment: newComment });

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, comment: newComment } : order
        )
      );
    } catch (error) {
      console.error("Error updating order comment:", error);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Orders"));
        const ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersData);
        setFilteredOrders(ordersData); // Initialize filtered orders
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let updatedOrders = [...orders];

    // Search filter
    if (searchTerm) {
      updatedOrders = updatedOrders.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.billingDetails?.email
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.items?.some((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Sort filter (newest and oldest)
    updatedOrders.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      // Sort by newest (default) or oldest
      return filterType === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredOrders(updatedOrders);
  }, [searchTerm, filterType, orders]);

  if (loading) {
    return <p>Loading orders...</p>;
  }

  const validateField = (field) => (field ? field : "N/A");

  return (
    <Layout header={5}>
      <PageBanner pageName="Manage Orders" />

      <section className="order-management-section pt-130 pb-80">
        <div className="container">
          {/* Filters Section */}
          <div className="product-search-filter wow fadeInUp mb-4">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="row align-items-center">
                {/* Search Bar */}
                <div className="col-lg-3">
                  <div className="product-search mb-30">
                    <div className="form_group">
                      <input
                        type="search"
                        className="form_control"
                        placeholder="Search by ID, Email, or Item Name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button className="search-btn">
                        <i className="far fa-search" />
                      </button>
                    </div>
                  </div>
                </div>
                {/* Sort Dropdown */}
                <div className="col-lg-9">
                  <div className="row justify-content-between align-items-center mb-15">
                    <div className="col-lg-4 col-md-6">
                      <div className="show-text mb-15">
                        <p>Showing {filteredOrders.length} Results</p>
                      </div>
                    </div>
                    <div className="col-lg-8 col-md-6">
                      <div className="filter-category mb-15">
                        <ul>
                          <li>
                            <select
                              className="wide"
                              value={filterType}
                              onChange={(e) => setFilterType(e.target.value)}
                            >
                              <option value="newest">Sort by Newest</option>
                              <option value="oldest">Sort by Oldest</option>
                            </select>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Orders List */}
          <div className="row">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="col-lg-4 col-md-6 mb-4 wow fadeInUp"
                >
                  <div className="order-card bg-white p-4 rounded shadow hover-shadow">
                    <h3 className="title">Order ID: {validateField(order.id)}</h3>
                    <p>
                      <strong>Customer:</strong>{" "}
                      {validateField(
                        `${order.billingDetails?.firstName || ""} ${
                          order.billingDetails?.lastName || ""
                        }`
                      )}
                    </p>




                    <p>
                      <strong>URL:</strong>{" "}
                      {validateField(
                        `${order.productUrl || ""} `
                      )}
                    </p>


                       <p>
                      <strong>SessionID:</strong>{" "}
                      {validateField(
                        `${order.sessionId || ""} `
                      )}
                    </p>


                
                    <p>
                      <strong>Email:</strong>{" "}
                      {validateField(order.billingDetails?.email)}
                    </p>
                    <p>
                      <strong>Total:</strong> ${validateField(order.amount_total)}
                    </p>
                    <p>
  <strong>Items:</strong>{" "}
  {order.items && order.items.length > 0
    ? order.items.map((item, index) => (
        <span key={index}>
          {item.name} (Qty: {item.quantity}){index !== order.items.length - 1 ? ", " : ""}
        </span>
      ))
    : "N/A"}
</p>

                    <p>
                      <strong>Status:</strong> {validateField(order.status)}
                    </p>
                    <p>
                      <strong>Comment:</strong> {validateField(order.comment)}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {validateField(
                        order.createdAt
                          ? new Date(order.createdAt).toLocaleString()
                          : null
                      )}
                    </p>
<p><br/></p>

                    {/* Status Dropdown */}
                    <div className="form_group mt-3">
                    <p> Change Status</p>
                      <select
                        id={`status-${order.id}`}
                        className="form-control"
                        value={order.status || "Pending"}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        <option value="Complete">Complete</option>
                        <option value="Done">Done</option>
                        <option value="Pending">Pending</option>
                      </select>
                    </div>
                    <div style={{ borderTop: "1px solid transparent", margin: "20px 0" }}></div>
                <div style={{ borderTop: "1px solid transparent", margin: "20px 0" }}></div>
                <div style={{ borderTop: "1px solid #ccc", margin: "20px 0" }}></div>
                     
                    {/* Comment Text Area */}
                    <div className="form_group mt-3">
                    <p> Add comments (auto-saves)</p>
                     
                      <textarea
                        id={`comment-${order.id}`}
                        className="form_control"
                        placeholder="Write a comment..."
                        defaultValue={order.comment || ""}
                        onBlur={(e) => handleCommentChange(order.id, e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center w-100">No orders found.</p>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ManageOrders;
