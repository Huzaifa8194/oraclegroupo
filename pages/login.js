import React, { useState } from "react";
import { useRouter } from "next/router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../src/firebaseConfig"; // Your Firebase configuration file
import Layout from "../src/layouts/Layout";
import PageBanner from "../src/components/PageBanner";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Sign in using Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);
      toast.info("Login successful!");
      router.push("/"); // Redirect to a dashboard or any protected page
    } catch (err) {
      console.error("Error logging in:", err.message);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout header={4}>
      <PageBanner pageName="Login" />

      <section className="login-section pt-100 pb-100">
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

            {/* Login Form */}
            <div className="col-lg-6 col-md-12">
              <div className="login-form-wrapper">
                <h3 className="text-center mb-30">Login to Your Account</h3>
                <form onSubmit={handleLogin}>
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
                  <div className="text-center">
                    <button
                      type="submit"
                      className="main-btn bordered-btn bordered-yellow"
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </button>
                  </div>
                </form>
                <div className="text-center mt-4">
                  <p>
                    Don't have an account?{" "}
                    <a href="/register" className="text-primary">
                      Register here
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

export default Login;
