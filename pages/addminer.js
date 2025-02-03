"use client";

import React, { useState , useEffect} from "react";
import { useDropzone } from "react-dropzone";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../src/firebaseConfig";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import Layout from "../src/layouts/Layout";
import PageBanner from "../src/components/PageBanner";
import { toast } from "react-toastify";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";


const AddMiningEquipment = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [hashrate, setHashrate] = useState("N/A");
  const [algorithm, setAlgorithm] = useState("N/A");
  const [power, setPower] = useState("N/A");
  const [minimumOrderQty, setMinimumOrderQty] = useState("N/A");
  const [availability, setAvailability] = useState("N/A");
  const [images, setImages] = useState([]); // Store selected files
  const [loading, setLoading] = useState(false);

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


  const onDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file), // Create a preview URL
      })
    );
    setImages((prev) => [...prev, ...newFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: true,
  });

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (imageFiles) => {
    if (!imageFiles.length) return [];

    try {
      const uploadPromises = imageFiles.map(async (imageFile) => {
        const filePath = `equipment-images/${uuidv4()}-${imageFile.name}`;
        const imageRef = ref(storage, filePath);
        const snapshot = await uploadBytes(imageRef, imageFile);
        const imageUrl = await getDownloadURL(snapshot.ref);
        return imageUrl;
      });

      const imageUrls = await Promise.all(uploadPromises);
      console.log("Images successfully uploaded:", imageUrls);
      return imageUrls;
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.info("Unexpected error occurred during the image upload.");
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrls = await handleImageUpload(images);

      const newEquipment = {
        name,
        description,
        price: parseFloat(price),
        hashrate,
        algorithm,
        power,
        minimumOrderQty,
        availability,
        imageUrls,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "miningEquipment"), newEquipment);

      toast.info("Equipment added successfully!");
      router.push("/minerdetail");
    } catch (error) {
      console.error("Error adding equipment:", error);
      toast.info("Failed to add equipment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout header={5}>
      <PageBanner pageTitle="Add Equipment" pageName="Add Equipment" />
      <section className="form-section pt-100 pb-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-8">
              <div className="section-title text-center mb-50">
                <span className="sub-title">Add Equipment</span>
                <h2>Fill in the details to add a new equipment item</h2>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-10">
              <form
                onSubmit={handleSubmit}
                className="equipment-form wow fadeInUp"
              >
                <div className="form-group">
                  <label style={{ color: "black" }}>Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label style={{ color: "black" }}>Description:</label>
                  <textarea
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="form-group">
                  <label style={{ color: "black" }}>Price:</label>
                  <input
                    type="number"
                    className="form-control"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label style={{ color: "black" }}>Hashrate:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={hashrate}
                    onChange={(e) => setHashrate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label style={{ color: "black" }}>Algorithm:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={algorithm}
                    onChange={(e) => setAlgorithm(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label style={{ color: "black" }}>Power:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={power}
                    onChange={(e) => setPower(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label style={{ color: "black" }}>Minimum Order Qty:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={minimumOrderQty}
                    onChange={(e) => setMinimumOrderQty(e.target.value)}
                  />
                </div>

                <div className="">
                  <p style={{ color: "black" }}>Availability:</p>
                </div>
                <div className="mb-20">
                  <select
                    className="form-control"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                  >
                    <option value="N/A">N/A</option>
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>

                <div style={{ borderTop: "1px solid transparent", margin: "20px 0" }}></div>
                <div style={{ borderTop: "1px solid transparent", margin: "20px 0" }}></div>
                <div style={{ borderTop: "1px solid #ccc", margin: "20px 0" }}></div>

                <div className="form-group">
                  <label style={{ color: "black" }}>
                    Upload Images (Can upload multiple):
                  </label>
                  <div
                    {...getRootProps({
                      className: "dropzone",
                      style: {
                        border: "2px dashed #ccc",
                        padding: "20px",
                        textAlign: "center",
                        borderRadius: "8px",
                        cursor: "pointer",
                      },
                    })}
                  >
                    <input {...getInputProps()} />
                    <p>Drag and drop images here, or click to select files</p>
                  </div>
                  <div
                    className="preview-container"
                    style={{ marginTop: "10px" }}
                  >
                    {images.map((image, index) => (
                      <div
                        key={index}
                        style={{
                          display: "inline-block",
                          margin: "10px",
                          position: "relative",
                        }}
                      >
                        <img
                          src={image.preview}
                          alt="Preview"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            background: "red",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                            cursor: "pointer",
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="main-btn bordered-btn bordered-yellow"
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add Equipment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AddMiningEquipment;
