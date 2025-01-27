"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../src/firebaseConfig"; // Ensure this is your Firebase config
import PageBanner from "../src/components/PageBanner";
import Layout from "../src/layouts/Layout";

const Shop = () => {
  const [miners, setMiners] = useState([]);
  const [filteredMiners, setFilteredMiners] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

  const [loading, setLoading] = useState(true);

  // Fetch miners from Firestore
  useEffect(() => {
    const fetchMiners = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "miningEquipment"));
        const minersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMiners(minersData);
        setFilteredMiners(minersData); // Set initial filtered miners
      } catch (error) {
        console.error("Error fetching miners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMiners();
  }, []);

  // Handle Search Filtering
  useEffect(() => {
    const results = miners.filter((miner) =>
      miner.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMiners(results);
  }, [searchTerm, miners]);

  // Handle Sorting
  useEffect(() => {
    let sortedMiners = [...filteredMiners];
    if (sortOption === "priceHighToLow") {
      sortedMiners.sort((a, b) => b.price - a.price);
    } else if (sortOption === "priceLowToHigh") {
      sortedMiners.sort((a, b) => a.price - b.price);
    }
    setFilteredMiners(sortedMiners);
  }, [sortOption]);

  if (loading) {
    return <p>Loading miners...</p>;
  }

  return (
    <Layout header={4}>
      <PageBanner pageTitle={"Shop"} pageName="Shop" />
      <section className="shop-page pt-170 pb-70">
        <div className="container">
          {/* Search and Filter Section */}
          <div className="product-search-filter wow fadeInUp mb-4">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="row align-items-center">
                <div className="col-lg-3">
                  {/* Search Bar */}
                  <div className="product-search mb-30">
                    <div className="form_group">
                      <input
                        type="search"
                        className="form_control"
                        placeholder="Search"
                        name="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <button className="search-btn">
                        <i className="far fa-search" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-lg-9">
                  {/* Sort Options */}
                  <div className="row justify-content-between align-items-center mb-15">
                    <div className="col-lg-4 col-md-6">
                      <div className="show-text mb-15">
                        <p>Showing {filteredMiners.length} Results</p>
                      </div>
                    </div>
                    <div className="col-lg-8 col-md-6">
                      <div className="filter-category mb-15">
                        <ul>
                          <li>
                            <select
                              className="wide"
                              onChange={(e) => setSortOption(e.target.value)}
                            >
                              <option value="">Sort by Newness</option>
                              <option value="priceHighToLow">Price High to Low</option>
                              <option value="priceLowToHigh">Price Low to High</option>
                            </select>
                          </li>
                          <li>
                            <Link href="/products">
                              <a>
                                <i className="far fa-list" />
                              </a>
                            </Link>
                          </li>
                          <li>
                            <Link href="/products">
                              <a>
                                <i className="far fa-th" />
                              </a>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Miners Grid */}
          <div className="row">
            {filteredMiners.map((miner) => (
              <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12" key={miner.id}>
                <div className="single-product-item mb-60">
                  <div className="product-img">
                    <img
                      src={
                        miner.imageUrls && miner.imageUrls.length > 0
                          ? miner.imageUrls[0] // Display the first image
                          : "/placeholder-image.png" // Use a placeholder if no images are available
                      }
                      alt={miner.name}
                      style={{
                        height: "250px",
                        width: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <div className="cart-button">
                      <Link href={`/miner-details/${miner.id}`}>
                        <a className="main-btn btn-yellow">View Details</a>
                      </Link>
                    </div>
                  </div>
                  <div className="product-info">
                    <h3 className="title">{miner.name}</h3>
                    <span className="price">
                      <span className="currency">$</span>
                      {miner.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
