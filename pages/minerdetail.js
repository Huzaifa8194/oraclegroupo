import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../src/firebaseConfig"; // Adjust path if necessary
import Layout from "../src/layouts/Layout";
import PageBanner from "../src/components/PageBanner";
import { toast } from "react-toastify";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";

import { getDoc } from "firebase/firestore";

const ViewMiners = () => {
  const [miners, setMiners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMiner, setEditingMiner] = useState(null); // Miner being edited
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state


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

  useEffect(() => {
    const fetchMiners = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "miningEquipment"));
        const minersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMiners(minersList);
      } catch (error) {
        console.error("Error fetching miners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMiners();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this miner?")) {
      try {
        await deleteDoc(doc(db, "miningEquipment", id));
        toast.info("Miner deleted successfully!");
        setMiners((prevMiners) => prevMiners.filter((miner) => miner.id !== id));
      } catch (error) {
        console.error("Error deleting miner:", error);
        toast.info("Failed to delete miner.");
      }
    }
  };

  const handleEdit = (miner) => {
    setEditingMiner(miner);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingMiner(null);
  };

  const handleSave = async () => {
    try {
      const minerRef = doc(db, "miningEquipment", editingMiner.id);
      await updateDoc(minerRef, editingMiner);
      setMiners((prevMiners) =>
        prevMiners.map((miner) =>
          miner.id === editingMiner.id ? editingMiner : miner
        )
      );
      toast.info("Miner updated successfully!");
      handleModalClose();
    } catch (error) {
      console.error("Error updating miner:", error);
      toast.info("Failed to update miner.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingMiner((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Layout header={5}>
      <PageBanner pageTitle="Manage Miners" pageName="View Miners" />
      <section className="miners-list-section pt-100 pb-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-10">
              <div className="section-title text-center mb-50">
                <span className="sub-title">All Miners</span>
                <h2>Manage Mining Equipment</h2>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="text-center">Loading miners...</div>
          ) : miners.length === 0 ? (
            <div className="text-center">No miners found.</div>
          ) : (
            <div className="row">
              {miners.map((miner) => (
                <div className="col-lg-4 col-md-6 mb-30" key={miner.id}>
                  <div className="miner-card">
                    <div className="miner-image">
                      <img
                        src={
                          miner.imageUrls && miner.imageUrls.length > 0
                            ? miner.imageUrls[0]
                            : "/placeholder-image.png"
                        }
                        alt={miner.name}
                        className="img-fluid"
                        style={{
                          height: "200px",
                          width: "100%",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </div>
                    <div className="miner-info">
                      <h4>{miner.name}</h4>
                      <p>{miner.description}</p>
                      <p>
                        <strong>Price:</strong> ${miner.price.toFixed(2)}
                      </p>
                      <p>
                        <strong>Hashrate:</strong> {miner.hashrate || "N/A"}
                      </p>
                      <p>
                        <strong>Algorithm:</strong> {miner.algorithm || "N/A"}
                      </p>
                      <p>
                        <strong>Power:</strong> {miner.power || "N/A"}
                      </p>
                      <p>
                        <strong>Minimum Order Qty:</strong>{" "}
                        {miner.minimumOrderQty || "N/A"}
                      </p>
                      <p>
                        <strong>Availability:</strong>{" "}
                        {miner.availability || "N/A"}
                      </p>
                      <div className="button-group mt-20">
                        <button
                          className="main-btn bordered-btn bordered-yellow"
                          onClick={() => handleEdit(miner)}
                        >
                          Edit
                        </button>
                        <button
                          className="main-btn bordered-btn bordered-red"
                          onClick={() => handleDelete(miner.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && editingMiner && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Miner Details</h2>
            <form>
              <div className="form-group">
                <label style={{color:'black'}}>Name:</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={editingMiner.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label style={{color:'black'}}>Description:</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={editingMiner.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div className="form-group">
                <label style={{color:'black'}}>Price:</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={editingMiner.price}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label style={{color:'black'}}>Hashrate:</label>
                <input
                  type="text"
                  className="form-control"
                  name="hashrate"
                  value={editingMiner.hashrate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label style={{color:'black'}}>Algorithm:</label>
                <input
                  type="text"
                  className="form-control"
                  name="algorithm"
                  value={editingMiner.algorithm}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label style={{color:'black'}}>Power:</label>
                <input
                  type="text"
                  className="form-control"
                  name="power"
                  value={editingMiner.power}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label style={{color:'black'}}>Minimum Order Qty:</label>
                <input
                  type="text"
                  className="form-control"
                  name="minimumOrderQty"
                  value={editingMiner.minimumOrderQty}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label style={{color:'black'}}>Availability:</label>
                <select
                  className="form-control"
                  name="availability"
                  value={editingMiner.availability}
                  onChange={handleInputChange}
                >
                  <option value="N/A">N/A</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="main-btn bordered-btn bordered-yellow"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="main-btn bordered-btn bordered-red"
                  onClick={handleModalClose}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ViewMiners;
