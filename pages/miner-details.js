'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../src/firebaseConfig"; // Firebase config
import Layout from "../src/layouts/Layout";
import PageBanner from "../src/components/PageBanner";

const MinerDetails = () => {
  const router = useRouter();
  const { id } = router.query; // Get miner ID from route
  const [miner, setMiner] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <p>Loading miner details...</p>;
  }

  if (!miner) {
    return <p>Miner not found!</p>;
  }

  return (
    <Layout>
      {/* Page Banner */}
      <PageBanner pageTitle={miner.name} pageName="Miner Details" />

      {/* Miner Details Section */}
      <section className="prodcuts-details-page pt-170 pb-130">
        <div className="container">
          <div className="product-details-wrapper wow fadeInUp">
            <div className="row">
              {/* Miner Image */}
              <div className="col-lg-7">
                <div className="product-details-slider">
                  <img src={miner.imageUrl} alt={miner.name} className="img-fluid" />
                </div>
              </div>

              {/* Miner Info */}
              <div className="col-lg-5">
                <div className="product-info mb-50">
                  <h3 className="title">{miner.name}</h3>
                  <div className="products-rating-price d-flex">
                    <ul className="ratings">
                      <li>
                        <i className="fas fa-star" />
                      </li>
                      <li>
                        <i className="fas fa-star" />
                      </li>
                      <li>
                        <i className="fas fa-star" />
                      </li>
                      <li>
                        <i className="fas fa-star" />
                      </li>
                      <li>
                        <i className="fas fa-star" />
                      </li>
                    </ul>
                    <span className="price">
                      <span className="currency">$</span>
                      {miner.price.toFixed(2)}
                    </span>
                  </div>
                  <p>{miner.description}</p>
                  <ul className="product-meta">
                    <li>
                      <span>Category :</span> Mining Equipment
                    </li>
                    <li>
                      <span>Availability :</span> In Stock
                    </li>
                  </ul>
                  <div className="product-cart">
                    <ul>
                      <li>
                        <input type="number" defaultValue={1} min={1} />
                      </li>
                      <li>
                        <a href="#" className="main-btn btn-yellow">
                          Add to cart
                        </a>
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

          {/* Tabs Section */}
          <div className="discription-area pb-120">
            <div className="discription-tabs mb-20">
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <a className="nav-link active" data-toggle="tab" href="#description">
                    Description
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" data-toggle="tab" href="#information">
                    Information
                  </a>
                </li>
              </ul>
            </div>
            <div className="tab-content">
              <div className="tab-pane fade show active" id="description">
                <div className="content-box">
                  <p>{miner.description}</p>
                </div>
              </div>
              <div className="tab-pane fade" id="information">
                <div className="content-box">
                  <p>
                    This miner is suitable for various mining applications. It is
                    designed to provide the best performance and reliability in its
                    class.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="review-form">
            <h3 className="title mb-15">Leave Your Reviews</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="row">
                <div className="col-lg-12">
                  <div className="form_group">
                    <ul className="ratings mb-25">
                      <li>
                        <span className="mr-2">Your Rating:</span>
                      </li>
                      {[...Array(5)].map((_, index) => (
                        <li key={index} className="star">
                          <a href="#">
                            <i className="fas fa-star" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="form_group">
                    <input
                      type="text"
                      className="form_control"
                      placeholder="Full Name"
                      name="name"
                      required
                    />
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="form_group">
                    <input
                      type="email"
                      className="form_control"
                      placeholder="Email Address"
                      name="email"
                      required
                    />
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="form_group">
                    <input
                      type="text"
                      className="form_control"
                      placeholder="Phone Number"
                      name="phone"
                      required
                    />
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form_group">
                    <textarea
                      name="message"
                      className="form_control"
                      placeholder="Write Message"
                    />
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="form_group">
                    <button className="main-btn btn-yellow">
                      Submit Review
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MinerDetails;
