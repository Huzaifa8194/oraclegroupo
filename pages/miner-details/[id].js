"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../src/firebaseConfig";
import Layout from "../../src/layouts/Layout";
import PageBanner from "../../src/components/PageBanner";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaBitcoin, FaMicrochip, FaPlug, FaBox, FaCheck, FaTimes } from "react-icons/fa";

import { toast } from "react-toastify";

const MinerDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [miner, setMiner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1); // State for quantity
  const [user, setUser] = useState(null); // State for logged-in user

  // Fetch miner details from Firestore
  useEffect(() => {
    const fetchMinerDetails = async () => {
      if (!id) return;

      try {
        const minerDoc = await getDoc(doc(db, "miningEquipment", id));
        if (minerDoc.exists()) {
          setMiner({ id: minerDoc.id, ...minerDoc.data() });
        } else {
          console.error("Miner not found!");
        }
      } catch (error) {
        console.error("Error fetching miner details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMinerDetails();
  }, [id]);

  // Fetch logged-in user using Firebase Authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Set the logged-in user
      } else {
        setUser(null); // No user logged in
      }
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, []);

  // Handle Add to Cart
  const handleAddToCart = async () => {
    if (!user) {
      toast.info("You need to log in to add items to your cart!");
      return;
    }

    try {
      const cartItem = {
        minerId: miner.id,
        name: miner.name,
        price: miner.price,
        quantity: parseInt(quantity), // Ensure quantity is a number
        imageUrl: miner.imageUrls ? miner.imageUrls[0] : "", // Use the first image if available
      };

      const userRef = doc(db, "Users", user.uid); // Use the user's UID to access their Firestore document
      await updateDoc(userRef, {
        cart: arrayUnion(cartItem), // Add item to the user's cart
      });

      toast.info("Item added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.info("Failed to add item to cart. Please try again.");
    }
  };

  // Render loading or error messages
  if (loading) {
    return <p>Loading miner details...</p>;
  }

  if (!miner) {
    return <p>Miner not found!</p>;
  }

  // Carousel settings for react-slick
  const carouselSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <Layout header={4}>
      {/* Page Banner */}
      <PageBanner pageTitle={miner.name} pageName="Miner Details" />

      {/* Miner Details Section */}
      <section className="prodcuts-details-page pt-70 pb-70">
        <div className="container">
          <div className="product-details-wrapper wow fadeInUp">
            <div className="row">
              {/* Miner Images Carousel */}
              <div className="col-lg-7">
                <div className="product-details-slider">
                  {miner.imageUrls && miner.imageUrls.length > 0 ? (
                    <Slider {...carouselSettings}>
                      {miner.imageUrls.map((imageUrl, index) => (
                        <div key={index}>
                          <img
                            src={imageUrl}
                            alt={`${miner.name} - Image ${index + 1}`}
                            className="img-fluid"
                            style={{
                              height: "400px",
                              objectFit: "cover",
                              borderRadius: "8px",
                              width: "100%",
                            }}
                          />
                        </div>
                      ))}
                    </Slider>
                  ) : (
                    <p>No images available for this miner.</p>
                  )}
                </div>
              </div>

              {/* Miner Info */}
              <div className="col-lg-5">
                <div className="product-info mb-50">
                  <h3 className="title">{miner.name}</h3>

                  {/* Price */}
                  <h4 className="price mb-20" style={{ display: "block" }}>
                    <span className="currency">$</span>
                    {miner.price.toFixed(2)}
                  </h4>

                  {/* Attributes */}
                  <ul className="product-meta">
                    <li>
                      <strong>Hashrate:</strong> {miner.hashrate || "N/A"}
                    </li>
                    <li>
                      <strong>Algorithm:</strong> {miner.algorithm || "N/A"}
                    </li>
                    <li>
                      <strong>Power:</strong> {miner.power || "N/A"}
                    </li>
                    <li>
                      <strong>Minimum Order Qty:</strong> {miner.minimumOrderQty || "N/A"}
                    </li>
                    <li>
                      <strong>Availability:</strong>{" "}
                      {miner.availability === "In Stock" ? "In Stock" : "Out of Stock"}
                    </li>
                  </ul>

                  {/* Add to Cart Section */}
                  <div className="product-cart">
                    <ul>
                      <li>
                        <input
                          type="number"
                          value={quantity}
                          min={1}
                          onChange={(e) => setQuantity(e.target.value)}
                          className="form-control"
                        />
                      </li>
                      <li>
                        <button
                          onClick={handleAddToCart}
                          className="main-btn btn-yellow"
                        >
                          Add to Cart
                        </button>
                      </li>
                      <li>
                        <a href="#" className="wishlist-btn">
                          <i className="far fa-heart" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description Area */}
          <div className="description-area pb-30 mb-30 mt-30">
            <div className="description-box">
              <h3 className="description-title">Description</h3>
              <p className="description-text">{miner.description}</p>
            </div>
          </div>

          {/* New Tabs Section */}
          <div className="row">
            {/* Tab: Hashrate */}
            <div className="col-lg-4 mb-4">
              <div className="tab-box">
                <h3 className="tab-title">
                  <FaBitcoin style={{ color: "#f7931a", marginRight: "8px" }} />
                  Hashrate
                </h3>
                <p className="tab-content">{miner.hashrate || "N/A"}</p>
              </div>
            </div>

            {/* Tab: Algorithm */}
            <div className="col-lg-4 mb-4">
              <div className="tab-box">
                <h3 className="tab-title">
                  <FaMicrochip style={{ color: "#007bff", marginRight: "8px" }} />
                  Algorithm
                </h3>
                <p className="tab-content">{miner.algorithm || "N/A"}</p>
              </div>
            </div>

            {/* Tab: Power */}
            <div className="col-lg-4 mb-4">
              <div className="tab-box">
                <h3 className="tab-title">
                  <FaPlug style={{ color: "#28a745", marginRight: "8px" }} />
                  Power
                </h3>
                <p className="tab-content">{miner.power || "N/A"}</p>
              </div>
            </div>

            {/* Tab: Minimum Order Qty */}
            <div className="col-lg-6 mb-4">
              <div className="tab-box">
                <h3 className="tab-title">
                  <FaBox style={{ color: "#ffc107", marginRight: "8px" }} />
                  Minimum Order Qty
                </h3>
                <p className="tab-content">{miner.minimumOrderQty || "N/A"}</p>
              </div>
            </div>

            {/* Tab: Availability */}
            <div className="col-lg-6 mb-4">
              <div className="tab-box">
                <h3 className="tab-title">
                  {miner.availability === "In Stock" ? (
                    <FaCheck style={{ color: "#28a745", marginRight: "8px" }} />
                  ) : (
                    <FaTimes style={{ color: "#dc3545", marginRight: "8px" }} />
                  )}
                  Availability
                </h3>
                <p className="tab-content">{miner.availability || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MinerDetails;
