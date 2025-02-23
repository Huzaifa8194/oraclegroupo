import { useState } from "react";
import Link from "next/link";
import { db } from "../firebaseConfig"; // Ensure Firebase is configured
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import emailjs from "emailjs-com";

const Footer = ({ footer }) => {
  switch (footer) {
    default:
      return <DefaultFooter />;
  }
};

export default Footer;

const DefaultFooter = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email || !phone) {
      toast.error("Please enter both email and phone.");
      return;
    }

    setLoading(true);

    try {
      // Save the subscriber data to Firestore
      await addDoc(collection(db, "subscribers"), {
        email,
        phone,
        subscribedAt: new Date(),
      });

      // Prepare parameters for EmailJS to send a confirmation email
      const templateParams = {
        email: email,
        phone: phone,
        subject: "Newsletter Subscription Confirmation",
        message: "Thank you for subscribing to our newsletter!",
      };

      // Send the email using EmailJS (free service)
      await emailjs.send(
        "service_x4452hp",      // Replace with your EmailJS service ID
        "template_av9xumx",     // Replace with your EmailJS template ID
        templateParams,
        "FKxzQ74ZqkhfWk__Z"          // Replace with your EmailJS public key/user ID
      );

      toast.success("Subscribed successfully! A confirmation email has been sent.");
      setEmail("");
      setPhone("");
    } catch (error) {
      console.error("Error subscribing:", error);
      toast.error("Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="footer-default footer-white dark-black-bg">
      <div className="container">
        <div className="footer-top wow fadeInUp">
          <div className="row">
            <div className="col-lg-4 col-md-12 footer-contact-item">
              <div className="contact-info d-flex justify-content-center">
                <div className="site-logo text-center">
                  <Link href="/">
                    <a className="brand-logo" style={{ width: "150px" }}>
                      <img
                        src="/assets/images/logo/oraclelogo.png"
                        alt="Footer Logo"
                      />
                    </a>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-12 footer-contact-item">
              <div className="contact-info d-flex">
                <div
                  className="icon"
                  style={{ backgroundColor: "white", color: "#1F1E17" }}
                >
                  <i className="flaticon-placeholder" />
                </div>
                <div className="text">
                  <h5>Locations</h5>
                  <h6>Asunción, Paraguay</h6>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-12 footer-contact-item">
              <div className="contact-info d-flex">
                <div
                  className="icon"
                  style={{ backgroundColor: "white", color: "#1F1E17" }}
                >
                  <i className="flaticon-placeholder" />
                </div>
                <div className="text">
                  <h5>Email Us</h5>
                  <h6>
                    <a href="mailto:hotlineinfo@gmial.com">
                      hotlineinfo@gmial.com
                    </a>
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-widget pt-70 pb-25">
          <FooterMenu />
        </div>
        <div className="footer-newsletter footer-newsletter-one text-white wow fadeInUp">
          <div className="row">
            <div className="col-xl-3">
              <div className="footer-text">
                <h5>Subscrive Our Newsletter To Get More Updates</h5>
              </div>
            </div>
            <div className="col-xl-9">
              <div className="newsletter-form">
                <form onSubmit={handleSubscribe}>
                  <div className="row">
                    <div className="col-lg-5">
                      <div className="form_group">
                        <input
                          type="email"
                          className="form_control"
                          placeholder="Email Address"
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required=""
                        />
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="form_group">
                        <input
                          type="text"
                          className="form_control"
                          placeholder="Phone"
                          name="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required=""
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <div className="form_group">
                        <button className="main-btn btn-yellow" type="submit" disabled={loading}>
                          {loading ? "Subscribing..." : "Subscribe Now"}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          <div className="col-lg-12">
            <div className="copyright-text text-center">
              <p>© 2025 Oracle. All Rights Reserved</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterMenu = () => (
  <div className="row">
    <div className="col-xl-4 col-lg-4 col-md-5 col-sm-12">
      <div className="footer-widget about-widget mb-40 wow fadeInDown">
        <h4 className="widget-title">About Us</h4>
        <div className="footer-about-content">
          <p>
            Oracle Group, founded by a U.S.-Canadian team with strong business
            ties, specializes in real estate, film, advanced power systems, and
            global cryptocurrency investments, led by Saul Stricker.
          </p>
          <div className="social-box">
            <h4 className="mb-15">Follow On</h4>
            <ul className="social-link">
              <li>
                <a href="#">
                  <i className="fab fa-facebook-f" />
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fab fa-twitter" />
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fab fa-linkedin" />
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fab fa-youtube" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div className="col-lg-4 col-lg-4 col-md-7 col-sm-12">
      <div className="footer-widget footer-nav-widget mb-40 wow fadeInUp">
        <h4 className="widget-title">Services</h4>
        <div className="footer-widget-nav">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about">Who We Are</a>
            </li>
            <li>
              <a href="/rates">Start Mining</a>
            </li>
            <li>
              <a href="/products">Our Products</a>
            </li>
            <li>
              <a href="/cart">Cart</a>
            </li>
            <li>
              <a href="/checkout">Checkout</a>
            </li>
          </ul>
          <ul>
            <li>
              <a href="/calculator">Calculator</a>
            </li>
            <li>
              <a href="/contact">Contact Us</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div className="col-lg-4 col-lg-4 col-md-6 col-sm-12">
      <div className="footer-widget recent-post-widget mb-40 wow fadeInDown">
        <h4 className="widget-title">Recent News</h4>
        <ul className="post-widget-wrap">
          <li className="post-item">
            <img src="/assets/images/blog/news1r.jpg" alt="Post Image" />
            <div className="post-title-date">
              <h3 className="title">
                <Link href="/blog-details">
                  <a>Bitcoin Halving Countdown: What It Means for Crypto Miners in 2025s</a>
                </Link>
              </h3>
              <span className="posted-on">
                <i className="fas fa-calendar-alt" />
                <a href="#">25 March 2022</a>
              </span>
            </div>
          </li>
          <li className="post-item">
            <img src="/assets/images/blog/news2r.jpg" alt="Post Image" />
            <div className="post-title-date">
              <h3 className="title">
                <Link href="/blog-details">
                  <a>Top Mining Trends to Watch: Maximizing Profits in a Competitive Market</a>
                </Link>
              </h3>
              <span className="posted-on">
                <i className="fas fa-calendar-alt" />
                <a href="#">25 March 2022</a>
              </span>
            </div>
          </li>
        </ul>
        <Link href="#">
          <a className="more-btn">View More News</a>
        </Link>
      </div>
    </div>
  </div>
);
