"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../src/firebaseConfig"; // Adjust path as needed
import Layout from "../src/layouts/Layout";
import PageBanner from "../src/components/PageBanner";
import emailjs from "emailjs-com";
import { toast } from "react-toastify";

const SendNewsletter = () => {
  const router = useRouter();
  const auth = getAuth();
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Admin Authentication Check
  useEffect(() => {
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
  }, [auth, router]);

  const handleSendNewsletter = async (e) => {
    e.preventDefault();

    if (!subject || !content) {
      toast.error("Please fill in both subject and content.");
      return;
    }

    setLoading(true);
    try {
      // Fetch all subscribers from Firestore
      const subscribersSnapshot = await getDocs(collection(db, "subscribers"));
      if (subscribersSnapshot.empty) {
        toast.info("No subscribers found.");
        setLoading(false);
        return;
      }
      // Extract subscriber emails
      const subscribers = subscribersSnapshot.docs.map((doc) => doc.data().email);

      // Send the newsletter email to each subscriber using EmailJS
      for (const subscriberEmail of subscribers) {
        const templateParams = {
          to_email: subscriberEmail,
          subject: subject,
          message: content,
        };

        await emailjs.send(
            "service_x4452hp",      // Replace with your EmailJS service ID
            "template_av9xumx",     // Replace with your EmailJS template ID
            templateParams,
            "FKxzQ74ZqkhfWk__Z"          // Replace with your EmailJS public key/user ID
          );
      }
      toast.success("Newsletter sent successfully to all subscribers!");
      setSubject("");
      setContent("");
    } catch (error) {
      console.error("Error sending newsletter:", error);
      toast.error("Failed to send newsletter. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout header={5}>
      <PageBanner pageName={"Send Newsletter"} />
      <section className="send-newsletter-section pt-100 pb-100">
        <div className="container">
          <h2 className="section-title">Send Newsletter</h2>
          <p>Compose your newsletter and send it to all subscribers.</p>
          <form onSubmit={handleSendNewsletter}>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                type="text"
                className="form_control"
                placeholder="Enter newsletter subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                className="form_control"
                placeholder="Enter newsletter content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows="10"
              />
              {/* Optionally, replace the textarea with a rich text editor such as React Quill */}
            </div>
            <div className="form-group text-center">
              <button type="submit" className="main-btn btn-yellow" disabled={loading}>
                {loading ? "Sending..." : "Send Newsletter"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default SendNewsletter;
