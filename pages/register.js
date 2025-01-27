"use client";

import React, { useState } from "react";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../src/firebaseConfig"; // Your Firebase configuration file
import Layout from "../src/layouts/Layout";
import PageBanner from "../src/components/PageBanner";

import { toast } from "react-toastify";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      // Create a new user using Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create a document in the "Users" collection with the default role
      await setDoc(doc(db, "Users", user.uid), {
        email: user.email,
        role: "customer", // Default role
      });

      toast.info("Registration successful!");
      router.push("/login"); // Redirect to the login page after registration
    } catch (err) {
      console.error("Error registering user:", err.message);
      setError("Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout header={4}>
      <PageBanner pageName="Register" />

      <section className="register-section pt-100 pb-100">
        <div className="container">
          <div className="row align-items-center">
            {/* Branding Image */}
            <div className="col-lg-6 col-md-12 mb-4">
              <div className="branding-image">
                <img
                  src="assets/images/logo/dd.png"
                  alt="Brand Logo"
                  className="img-fluid"
                  style={{
                    borderRadius: "20px",
                    width: "100%",
                    height: "auto",
                  }}
                />
              </div>
            </div>

            {/* Registration Form */}
            <div className="col-lg-6 col-md-12">
              <div className="register-form-wrapper">
                <h3 className="text-center mb-30">Create Your Account</h3>
                <form onSubmit={handleRegister}>
                  {error && (
                    <div className="alert alert-danger text-center">{error}</div>
                  )}
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="text-center">
                    <button
                      type="submit"
                      className="main-btn bordered-btn bordered-yellow"
                      disabled={loading}
                    >
                      {loading ? "Registering..." : "Register"}
                    </button>
                  </div>
                </form>
                <div className="text-center mt-4">
                  <p>
                    Already have an account?{" "}
                    <a href="/login" className="text-primary">
                      Login here
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Register;
