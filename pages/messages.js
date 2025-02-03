"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../src/firebaseConfig"; // Adjust path as needed
import PageBanner from "../src/components/PageBanner";
import Layout from "../src/layouts/Layout";
import { FaEnvelope, FaUser, FaClock } from "react-icons/fa";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";

import { getDoc } from "firebase/firestore";
import {doc } from "firebase/firestore";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Fetch messages from Firestore
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesRef = collection(db, "Messages");
        const messagesQuery = query(messagesRef, orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(messagesQuery);

        const messagesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMessages(messagesData);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) {
    return <p>Loading messages...</p>;
  }

  return (
    <Layout header={5}>
      <PageBanner pageName={"Messages"} />
      <section className="messages-section pt-100 pb-100 mb-70">
        <div className="container">
            <h2>You are viewing all the messages.</h2>
            <p>All messages send through contact us pages are shown here in descending order (newest first)</p>
          {messages.length > 0 ? (
            <div className="messages-grid">
              {messages.map((message) => (
                <div className="message-card" key={message.id}>
                  <div className="message-header">
                    <FaUser className="icon" />
                    <h4 style={{color: 'white'}}>{message.name}</h4>
                  </div>
                  <div className="message-body">
                    <p className="message-email">
                      <FaEnvelope className="icon"  style = {{color: 'white'}}/>  <p style={{color: 'white'}}>{message.email}</p>
                    </p>
                    <p className="message-text">{message.message}</p>
                  </div>
                  <div className="message-footer">
                    <FaClock className="icon" />
                    <span>
                      {new Date(message.timestamp.seconds * 1000).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-messages">
              <h3>No messages available</h3>
              <p>There are no messages to display at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Messages;
