import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import Slider from "react-slick";
import PageBanner from "../src/components/PageBanner";
import Layout from "../src/layouts/Layout";
import { logoSlider } from "../src/sliderProps";

import { toast } from "react-toastify";

import Head from "next/head";

const auth = getAuth();
const db = getFirestore();

const Contact = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [error, setError] = useState("");

  // Check if the user is authenticated
  // useEffect(() => {
  //   onAuthStateChanged(auth, (user) => {
  //     if (!user) {
  //       router.push("/login"); // Redirect to login if not logged in
  //     }
  //   });
  // }, [router]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const user = auth.currentUser;
    if (!user) {
      setError("You must be logged in to send a message.");
      router.push("/login");
      return;
    }

    try {
      // Add the message to Firestore
      await addDoc(collection(db, "Messages"), {
        name: formData.name,
        email: user.email, // Use logged-in user's email
        message: formData.message,
        timestamp: new Date(),
      });

      toast.info("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" }); // Reset form
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send your message. Please try again.");
    }
  };

  return (
    <Layout header={4}>
      <Head>
  {/* Primary Meta Tags */}
  <title>Contact Us - Get in Touch | Oracle Development</title>
  <meta name="description" content="Have any inquiries? Contact Oracle Development for mining solutions, hosting services, and expert support." />
  <meta name="keywords" content="contact Oracle Development, crypto mining support, hosting inquiries, mining consultation, get in touch" />
  <meta name="author" content="Oracle Development" />
  <meta name="robots" content="index, follow" />

  {/* Open Graph / Facebook */}
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://www.yourdomain.com/contact" />
  <meta property="og:title" content="Contact Us - Get in Touch | Oracle Development" />
  <meta property="og:description" content="Have any inquiries? Contact Oracle Development for mining solutions, hosting services, and expert support." />
  <meta property="og:image" content="https://www.yourdomain.com/assets/images/contact/og-image.jpg" />

  {/* Twitter */}
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://www.yourdomain.com/contact" />
  <meta property="twitter:title" content="Contact Us - Get in Touch | Oracle Development" />
  <meta property="twitter:description" content="Have any inquiries? Contact Oracle Development for mining solutions, hosting services, and expert support." />
  <meta property="twitter:image" content="https://www.yourdomain.com/assets/images/contact/twitter-image.jpg" />

  {/* Canonical URL */}
  <link rel="canonical" href="https://www.yourdomain.com/contact" />

  {/* Favicon */}
  <link rel="icon" type="image/png" href="/favicon.png" />

  {/* Structured Data for SEO (JSON-LD Schema) */}
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact Oracle Development",
      "url": "https://www.yourdomain.com/contact",
      "description": "Reach out to Oracle Development for inquiries on crypto mining, hosting, and expert consultation.",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+01234567899",
        "contactType": "customer service",
        "email": "hotlinein@gmail.com",
        "areaServed": "Worldwide",
        "availableLanguage": ["English", "Spanish"]
      }
    })}
  </script>
</Head>

      <PageBanner pageName={"Contact Us"} />
      <section className="contact-information-one p-r z-1 pt-215 pb-130">
        <div className="information-img_one wow fadeInRight">
          <img src="assets/images/contact/cminer.png" alt="Imaged" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-xl-9 col-lg-12">
              <div className="contact-two_information-box">
                <div className="section-title section-title-left mb-50 wow fadeInUp">
                  <span className="sub-title">Get In Touch</span>
                  <h2>We’re Ready to Help You! Have any Inquiries?</h2>
                </div>
                <div className="row">
                  <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="information-item-two info-one mb-30 wow fadeInDown">
                      <div className="icon">
                        <i className="far fa-map-marker-alt" />
                      </div>
                      <div className="info">
                        <h5>Locations</h5>
                        <p>Asunción, Paraguay</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="information-item-two mb-30 info-two wow fadeInUp">
                      <div className="icon">
                        <i className="far fa-envelope-open-text" />
                      </div>
                      <div className="info">
                        <h5>Email Address</h5>
                        <p>
                          <a href="mailto:hotlinein@gmail.com">
                            hotlinein@gmail.com
                          </a>
                        </p>
                        <p>
                          <a href="mailto:www.info.net">www.info.net</a>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-12">
                    <div className="information-item-two mb-30 info-three wow fadeInDown">
                      <div className="icon">
                        <i className="far fa-phone" />
                      </div>
                      <div className="info">
                        <h5>Phone Number</h5>
                        <p>
                          <a href="tel:+01234567899">+012 (345) 678 99</a>
                        </p>
                        <p>
                          <a href="tel:+0123456">+0123456</a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-8">
                    <p>
                      Complimentary visits to our facilities, contact us to inquire.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*====== End Contact Information section ======*/}

      {/*====== Start Map section ======*/} 
      <section className="contact-page-map">
        <div className="map-box">
        <iframe
  src="https://maps.google.com/maps?q=Asunción,Paraguay&t=&z=13&ie=UTF8&iwloc=&output=embed"
  style={{ border: 0, width: "100%", height: "400px" }}
  allowFullScreen=""
  loading="lazy"
></iframe>

        </div>
      </section>
      {/*====== End Map section ======*/}

      {/*====== Start Contact Section ======*/} 
      <section className="contact-three pb-70 wow fadeInUp">
        <div className="container">
          <div className="row justify-content-end">
            <div className="col-xl-7 col-lg-10">
              <div className="contact-three_content-box">
                <div className="section-title section-title-left mb-60">
                  <span className="sub-title">Get In Touch</span>
                  <h2>Send Us A Message</h2>
                </div>
                <div className="contact-form">
                  <form onSubmit={handleSubmit}>
                    <div className="form_group">
                      <input
                        type="text"
                        className="form_control"
                        placeholder="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form_group">
                      <input
                        type="email"
                        className="form_control"
                        placeholder="Email Address"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form_group">
                      <textarea
                        className="form_control"
                        placeholder="Write Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    {error && <p className="error-text">{error}</p>}
                    <div className="form_group">
                      <button className="main-btn btn-yellow" type="submit">
                        Send Message
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*====== End Contact Section ======*/}

      {/*====== Start Partner Section ======*/} 
      {/* <section className="partners-one p-r z-1 pt-50 pb-130">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="section-title text-center mb-30 wow fadeInUp">
                <h4>We Have More Then 1235+ Global Partners</h4>
              </div>
            </div>
          </div>
          <Slider {...logoSlider} className="partner-slider-one wow fadeInDown">
            <div className="partner-item-two">
              <div className="partner-img">
                <img src="assets/images/partner/img-7.png" alt="partner image" />
              </div>
            </div>
            <div className="partner-item-two">
              <div className="partner-img">
                <img src="assets/images/partner/img-8.png" alt="partner image" />
              </div>
            </div>
            <div className="partner-item-two">
              <div className="partner-img">
                <img src="assets/images/partner/img-9.png" alt="partner image" />
              </div>
            </div>
            <div className="partner-item-two">
              <div className="partner-img">
                <img src="assets/images/partner/img-10.png" alt="partner image" />
              </div>
            </div>
            <div className="partner-item-two">
              <div className="partner-img">
                <img src="assets/images/partner/img-11.png" alt="partner image" />
              </div>
            </div>
            <div className="partner-item-two">
              <div className="partner-img">
                <img src="assets/images/partner/img-12.png" alt="partner image" />
              </div>
            </div>
          </Slider>
        </div>
      </section> */}
    </Layout>
  );
};

export default Contact;
