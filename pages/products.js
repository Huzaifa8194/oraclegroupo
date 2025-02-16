"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../src/firebaseConfig"; // Ensure this is your Firebase config
import PageBanner from "../src/components/PageBanner";
import Layout from "../src/layouts/Layout";
import Head from "next/head";

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
      <Head>
      {/* Primary Meta Tags */}
      <title>Shop Mining Equipment - Oracle Development Group</title>
      <meta
        name="description"
        content="Browse high-quality mining equipment at Oracle Development Group. Get the best prices on ASIC miners, GPUs, and mining accessories with competitive hosting options."
      />
      <meta
        name="keywords"
        content="crypto mining equipment, buy ASIC miners, mining hardware, Bitcoin miners, best mining rigs, Oracle Development Group, mining shop"
      />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Oracle Development Group" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://oracledevelopmentgroup.com/shop" />
      <meta property="og:title" content="Shop Mining Equipment - Oracle Development Group" />
      <meta
        property="og:description"
        content="Find premium mining equipment at Oracle Development Group. Explore a wide range of ASIC miners, GPUs, and accessories at competitive prices."
      />
      <meta property="og:image" content="https://oracledevelopmentgroup.com/assets/images/shop-mining.jpg" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content="https://oracledevelopmentgroup.com/shop" />
      <meta name="twitter:title" content="Shop Mining Equipment - Oracle Development Group" />
      <meta
        name="twitter:description"
        content="Discover high-performance mining equipment at Oracle Development Group. Buy Bitcoin miners, ASICs, GPUs, and more at the best prices."
      />
      <meta name="twitter:image" content="https://oracledevelopmentgroup.com/assets/images/shop-mining.jpg" />

      {/* Canonical URL */}
      <link rel="canonical" href="https://oracledevelopmentgroup.com/shop" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />

      {/* Structured Data (Schema Markup for SEO) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Store",
          "name": "Oracle Development Group Shop",
          "url": "https://oracledevelopmentgroup.com/shop",
          "description": "Oracle Development Group offers a variety of cryptocurrency mining equipment, including ASIC miners, GPUs, and accessories at competitive prices.",
          "image": "https://oracledevelopmentgroup.com/assets/images/shop-mining.jpg",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "123 Crypto Lane",
            "addressLocality": "New York",
            "addressRegion": "NY",
            "postalCode": "10001",
            "addressCountry": "US"
          },
          "telephone": "+1-555-123-4567",
          "openingHours": "Mo-Fr 09:00-17:00",
          "offers": [
            {
              "@type": "Offer",
              "name": "ASIC Miners",
              "url": "https://oracledevelopmentgroup.com/shop/asic-miners",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            {
              "@type": "Offer",
              "name": "GPUs for Mining",
              "url": "https://oracledevelopmentgroup.com/shop/gpus",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            }
          ],
          "sameAs": [
            "https://facebook.com/oracledevelopment",
            "https://twitter.com/oracledev",
            "https://linkedin.com/company/oracledevelopment"
          ]
        })}
      </script>
    </Head>
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
