import Link from "next/link";
import { Nav, Tab } from "react-bootstrap";
import Slider from "react-slick";
import OrgariumCounter from "../src/components/OrgariumCounter";
import ProgressBar from "../src/components/ProgressBar";
import React, { useEffect, useState, useRef } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const auth = getAuth();
const db = getFirestore();


import Head from "next/head";

import ProjectOneSlider from "../src/components/sliders/ProjectOneSlider";
import Layout from "../src/layouts/Layout";
import {
  FaServer,
  FaTools,
  FaChartLine,
  FaCalculator,
  FaShoppingCart,
  FaHeadset,
} from "react-icons/fa";

import {
  heroSliderOne,
  logoSlider,
  testimonialSliderOne,
} from "../src/sliderProps";
const Index = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if the user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isAuthenticated) {
      setError("You need to be logged in to send a message.");
      return;
    }

    try {
      // Save the message to Firestore
      await addDoc(collection(db, "Messages"), {
        name: formData.name,
        email: auth.currentUser.email, // Use logged-in user's email
        message: formData.message,
        timestamp: new Date(),
      });

      setSuccess("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" }); // Reset form
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send your message. Please try again.");
    }
  };

   const [marketCap, setMarketCap] = useState(null);
    const [btcVolume, setBtcVolume] = useState(null);
    const [miningDifficulty, setMiningDifficulty] = useState(null);
    const [btcPrice, setBtcPrice] = useState(null);
    const [btcDominance, setBtcDominance] = useState(null);
    const [btcMarketCap, setBtcMarketCap] = useState(null);
    const [remainingTime, setRemainingTime] = useState("");
    const [btcPriceChart, setBtcPriceChart] = useState([]);
    const [loading, setLoading] = useState(true);
    const timerRef = useRef(null); // Ref to manage the countdown timer
  
    useEffect(() => {
    
      setLoading(true);
    
      const fetchWithRetry = async (url, retries = 3, delay = 2000) => {
        for (let i = 0; i < retries; i++) {
          try {
            const response = await fetch(url);
            if (response.ok) {
              return response.json();
            }
    
            const text = await response.text();
            if (text.includes("Throttled") || response.status === 429) {
              console.warn(`Rate limit hit. Retrying in ${delay / 1000} seconds...`);
              await new Promise((res) => setTimeout(res, delay));
            } else {
              throw new Error(`API request failed: ${text}`);
            }
          } catch (error) {
            console.error("Fetch error:", error);
          }
        }
        throw new Error("Max retries exceeded");
      };
    
      const cacheData = (key, data, ttl = 60000) => {
        localStorage.setItem(key, JSON.stringify({ data, expiry: Date.now() + ttl }));
      };
    
      const getCachedData = (key) => {
        const cached = localStorage.getItem(key);
        if (!cached) return null;
    
        const parsed = JSON.parse(cached);
        if (Date.now() > parsed.expiry) {
          localStorage.removeItem(key);
          return null;
        }
        return parsed.data;
      };
    
      const fetchData = async () => {
        try {
          let coingeckoData = getCachedData("coingecko_global");
          if (!coingeckoData) {
            coingeckoData = await fetchWithRetry("https://api.coingecko.com/api/v3/global");
            cacheData("coingecko_global", coingeckoData);
          }
    
          setMarketCap(`$${coingeckoData.data.total_market_cap.usd.toLocaleString()}`);
          setBtcVolume(`$${coingeckoData.data.total_volume.usd.toLocaleString()}`);
          setBtcMarketCap(`${coingeckoData.data.market_cap_percentage.btc.toFixed(2)}%`);
          setBtcDominance(`${coingeckoData.data.market_cap_percentage.btc.toFixed(2)}%`);
    
          let miningDifficulty = getCachedData("mining_difficulty");
          if (!miningDifficulty) {
            const blockchainResponse = await fetch("https://blockchain.info/q/getdifficulty");
            miningDifficulty = parseFloat(await blockchainResponse.text()).toFixed(2);
            cacheData("mining_difficulty", miningDifficulty);
          }
          setMiningDifficulty(miningDifficulty);
    
          const fetchHistoricalPrice = async (daysAgo) => {
            const pastTimestamp = new Date();
            pastTimestamp.setDate(pastTimestamp.getDate() - daysAgo);
            const unixTime = Math.floor(pastTimestamp.getTime() / 1000);
    
            const response = await fetch(
              `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=usd&from=${unixTime}&to=${unixTime + 86400}`
            );
            const data = await response.json();
    
            if (data.prices && data.prices.length > 0) {
              return parseFloat(data.prices[0][1]);
            } else {
              return null;
            }
          };
    
          const timeFrames = [
            { label: "24 hours ago", daysAgo: 1 },
            { label: "1 week ago", daysAgo: 7 },
            { label: "1 month ago", daysAgo: 30 },
            { label: "1 year ago", daysAgo: 365 },
          ];
    
          const historicalPrices = await Promise.all(
            timeFrames.map(async (timeFrame) => {
              const pastPrice = await fetchHistoricalPrice(timeFrame.daysAgo);
              return pastPrice
                ? {
                    label: timeFrame.label,
                    date: new Date(new Date().setDate(new Date().getDate() - timeFrame.daysAgo)).toDateString(),
                    price: `$${pastPrice.toLocaleString()}`,
                    change: (((btcPrice - pastPrice) / pastPrice) * 100).toFixed(2) + "%",
                  }
                : null;
            })
          );
    
          setBtcPriceChart([
            { label: "Today", date: new Date().toDateString(), price: btcPrice, change: null },
            ...historicalPrices.filter((entry) => entry !== null),
          ]);
    
          let currentBlockHeight = getCachedData("block_height");
          if (!currentBlockHeight) {
            const blockHeightResponse = await fetch("https://blockchain.info/q/getblockcount");
            currentBlockHeight = await blockHeightResponse.text();
            cacheData("block_height", currentBlockHeight);
          }
    
          const halvingInterval = 210000;
          const nextHalvingBlock = Math.ceil(currentBlockHeight / halvingInterval) * halvingInterval;
          const blocksToNextHalving = nextHalvingBlock - currentBlockHeight;
          const averageBlockTime = 10 * 60 * 1000;
          const nextHalvingDate = new Date(Date.now() + blocksToNextHalving * averageBlockTime);
    
          startCountdown(nextHalvingDate);
        } catch (error) {
          console.error("Error fetching Bitcoin data:", error);
        } finally {
          setLoading(false);
        }
      };
    
      const startCountdown = (halvingDate) => {
        if (timerRef.current) clearInterval(timerRef.current);
    
        timerRef.current = setInterval(() => {
          const now = new Date().getTime();
          const timeLeft = halvingDate.getTime() - now;
    
          if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
            setRemainingTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
          } else {
            setRemainingTime("Halving is happening now!");
            clearInterval(timerRef.current);
          }
        }, 1000);
      };
    
      fetchData();
    
      const socket = new WebSocket("wss://ws.coincap.io/prices?assets=bitcoin");
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.bitcoin) {
          setBtcPrice(`$${parseFloat(data.bitcoin).toLocaleString()}`);
        }
      };
    
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        socket.close();
      };
    }, []);
    

  
  
  return (




    
    <Layout header={4}>
          <Head>
      {/* Primary Meta Tags */}
      <title>Oracle Development Group - Reliable Cryptocurrency Mining Solutions</title>
      <meta
        name="description"
        content="Oracle Development Group offers top-tier crypto mining solutions, including premium hosting, real-time market insights, and optimized mining equipment. Join us today for seamless mining experiences!"
      />
      <meta name="keywords" content="crypto mining, bitcoin, ethereum, hosting, blockchain, mining profitability, oracle development group" />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Oracle Development Group" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://oracledevelopmentgroup.com" />
      <meta property="og:title" content="Oracle Development Group - Reliable Cryptocurrency Mining Solutions" />
      <meta property="og:description" content="Providing top-quality mining tools, optimized hosting, and real-time market data to enhance crypto profitability." />
      <meta property="og:image" content="https://oracledevelopmentgroup.com/assets/images/seo-image.jpg" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content="https://oracledevelopmentgroup.com" />
      <meta name="twitter:title" content="Oracle Development Group - Reliable Cryptocurrency Mining Solutions" />
      <meta name="twitter:description" content="Join Oracle Development Group for premium crypto mining tools, secure hosting, and the latest market insights." />
      <meta name="twitter:image" content="https://oracledevelopmentgroup.com/assets/images/seo-image.jpg" />

      {/* Canonical URL */}
      <link rel="canonical" href="https://oracledevelopmentgroup.com" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />

      {/* Structured Data for Rich Snippets */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Oracle Development Group",
          "url": "https://oracledevelopmentgroup.com",
          "logo": "https://oracledevelopmentgroup.com/assets/images/logo.png",
          "description": "We provide expert-level cryptocurrency mining solutions, including hosting, equipment, and live market insights.",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-555-123-4567",
            "contactType": "customer service",
            "areaServed": "Global",
            "availableLanguage": ["English"]
          },
          "sameAs": [
            "https://facebook.com/oracledevelopment",
            "https://twitter.com/oracledev",
            "https://linkedin.com/company/oracledevelopment"
          ]
        })}
      </script>
    </Head>
      <section className="hero-area-one">
        <Slider {...heroSliderOne} className="hero-slider-one">
          <div className="single-slider">
            <div
              className="image-layer bg_cover"
              style={{
                backgroundImage: "url(assets/images/hero/hero1.png)",
              }}
            />
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <div className="hero-content text-center">
                    <span
                      className="tag-line"
                      data-animation="fadeInDown"
                      data-delay=".4s"
                    >
                      ORACLE Development Group
                    </span>
                    <h1 data-animation="fadeInUp" data-delay=".5s">
                      Our Power. Your Miner.
                    </h1>
                    <h4 style={{ color: "white", fontWeight: "300" }}>
                      Complimentary visits to our facilities, contact us to
                      inquire.
                    </h4>
                    <br />
                    <div
                      className="hero-button"
                      data-animation="fadeInDown"
                      data-delay=".6s"
                    >
                      <Link href="/rates">
                        <p className="main-btn btn-yellow">Start Mining</p>
                      </Link>
                      <Link href="/contact">
                        <a className="main-btn bordered-btn bordered-white">
                          Contact Us
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="single-slider">
            <div
              className="image-layer bg_cover"
              style={{
                backgroundImage: "url(assets/images/hero/hero2.png)",
              }}
            />
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <div className="hero-content text-center">
                    <span
                      className="tag-line"
                      data-animation="fadeInDown"
                      data-delay=".4s"
                    >
                      ORACLE Development Group
                    </span>
                    <h1 data-animation="fadeInUp" data-delay=".5s">
                      Our Power. Your Miner.
                    </h1>
                    <h4 style={{ color: "white", fontWeight: "300" }}>
                      Complimentary visits to our facilities, contact us to
                      inquire.
                    </h4>
                    <br />
                    <div
                      className="hero-button"
                      data-animation="fadeInDown"
                      data-delay=".6s"
                    >
                      <Link href="/rates">
                        <a className="main-btn btn-yellow">Start Mining</a>
                      </Link>
                      <Link href="/contact">
                        <a className="main-btn bordered-btn bordered-white">
                          Contact Us
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="single-slider">
            <div
              className="image-layer bg_cover"
              style={{
                backgroundImage: "url(assets/images/hero/hero3.png)",
              }}
            />
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <div className="hero-content text-center">
                    <span
                      className="tag-line"
                      data-animation="fadeInDown"
                      data-delay=".4s"
                    >
                      ORACLE Development Group
                    </span>
                    <h1 data-animation="fadeInUp" data-delay=".5s">
                      Our Power. Your Miner.
                    </h1>
                    <h4 style={{ color: "white", fontWeight: "300" }}>
                      Complimentary visits to our facilities, contact us to
                      inquire.
                    </h4>
                    <br />
                    <div
                      className="hero-button"
                      data-animation="fadeInDown"
                      data-delay=".6s"
                    >
                      <Link href="/rates">
                        <a className="main-btn btn-yellow">Start Mining</a>
                      </Link>
                      <Link href="/contact">
                        <a className="main-btn bordered-btn bordered-white">
                          Contact Us
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="single-slider">
            <div
              className="image-layer bg_cover"
              style={{
                backgroundImage: "url(assets/images/hero/hero4.png)",
              }}
            />
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <div className="hero-content text-center">
                    <span
                      className="tag-line"
                      data-animation="fadeInDown"
                      data-delay=".4s"
                    >
                      ORACLE Development Group
                    </span>
                    <h1 data-animation="fadeInUp" data-delay=".5s">
                      Our Power. Your Miner.
                    </h1>
                    <h4 style={{ color: "white", fontWeight: "300" }}>
                      Complimentary visits to our facilities, contact us to
                      inquire.
                    </h4>
                    <br />
                    <div
                      className="hero-button"
                      data-animation="fadeInDown"
                      data-delay=".6s"
                    >
                      <Link href="/rates">
                        <a className="main-btn btn-yellow">Start Mining</a>
                      </Link>
                      <Link href="/contact">
                        <a className="main-btn bordered-btn bordered-white">
                          Contact Us
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Slider>
      </section>
      {/*====== End Hero Section ======*/}
      {/*====== Start Features Section ======*/}
      <section className="features-section">
        <div className="container-1350 ">
          <div className="features-wrap-one rounded-[10px]  wow fadeInUp">
            <div className="row justify-content-center">
              <div className="col-xl-4 col-md-6 col-sm-12">
                <div className="features-item d-flex mb-30">
                  <div className="fill-number">01</div>
                  <div className="icon">
                    <FaTools />
                  </div>
                  <div className="text">
                    <h5>Reliable Mining Equipment</h5>
                    <p>
                      Providing top-quality tools for efficient cryptocurrency
                      mining.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-md-6 col-sm-12">
                <div className="features-item d-flex mb-30">
                  <div className="fill-number">02</div>
                  <div className="icon">
                    <FaServer />
                  </div>
                  <div className="text">
                    <h5>Optimized Hosting Solutions</h5>
                    <p>Empowering miners with secure and reliable hosting.</p>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-md-6 col-sm-12">
                <div className="features-item d-flex mb-30">
                  <div className="fill-number">03</div>
                  <div className="icon">
                    <FaChartLine />
                  </div>
                  <div className="text">
                    <h5>Real-Time Market Insights</h5>
                    <p>
                      Delivering up-to-date data for smarter mining decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*====== End Features Section ======*/}
      {/*====== Start About Section ======*/}
      <section className="about-section p-r z-1 pt-150 pb-100">
  <div style={{ paddingLeft: "10%", paddingRight: "10%" }}>
    <div className="row align-items-center">
      {/* Left Side - Cryptocurrency Data */}
      <div className="col-xl-7 col-lg-8">
        <div className="about-one_content-box mb-50">
          <div className="section-title section-title-left mb-30 wow fadeInUp">
            <span className="sub-title">Live Crypto Data</span>
            <h2>Stay Updated with Real-Time Cryptocurrency Insights</h2>
          </div>

          {/* Countdown Timer */}
          <div className="crypto-data wow fadeInDown mb-35">
            <h3 className="mb-3 text-center">Time to Next Bitcoin Halving</h3>
            <div className="countdown-timer">
              <p className="time text-center">{remainingTime}</p>
            </div>
          </div>

          {/* Cryptocurrency Metrics */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="data-card text-center">
                <strong>Total Market Cap</strong>
                <p className="data-value">{loading ? "Loading..." : marketCap}</p>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="data-card text-center">
                <strong>BTC 24h Volume</strong>
                <p className="data-value">{loading ? "Loading..." : btcVolume}</p>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="data-card text-center">
                <strong>Mining Difficulty</strong>
                <p className="data-value">
                  {loading ? "Loading..." : miningDifficulty}
                </p>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="data-card text-center">
                <strong className="m-0 p-0" style={{margin: '0px', padding: '0px'}}>Live Bitcoin Price</strong>
                <p className="data-value">{loading ? "Loading..." : btcPrice}</p>
              </div>
            </div>
          </div>

          {/* Bitcoin Price Chart */}
          <div className="mt-4">
  <h4 className="text-center mb-3">Bitcoin Price History</h4>
  <div className="table-container">
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Date</th>
          <th>Price (USD)</th>
          <th>Change (%)</th>
        </tr>
      </thead>
      <tbody>
        {btcPriceChart.map((entry, index) => (
          <tr key={index}>
            <td>{entry.date}</td>
            <td>{entry.price.toLocaleString()}</td>
            <td style={{ color: entry.change >= 0 ? "green" : "red" }}>
              {entry.change ? `${entry.change}%` : "N/A"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

        </div>
      </div>

      {/* Right Side - Image */}
      <div className="col-xl-5 col-lg-4">
        <div className="about-one_image-box p-r mb-50 pl-100">
          <div className="about-img_two wow fadeInRight">
            <img
              style={{ borderRadius: "30px" }}
              src="assets/images/about/aboutimg_1.jpeg"
              alt="About Image"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <style jsx>{`
    .countdown-timer .time {
      font-size: 1.8rem;
      font-weight: bold;
      color: #ff5722;
    }
    .data-card {
      background: #fff;
      border-radius: 10px;
      padding: 10px 20px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }
    .data-card:hover {
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
    }
    .data-card h3 {
      font-size: 1rem;
      margin-bottom: 8px;
      color: #333;
    }
    .data-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: #2c2c2c;
    }
    .table-container {
      max-height: 250px;
      overflow-y: auto;
    }
    .table-container table {
      width: 100%;
      border-collapse: collapse;
      margin: 0 auto;
    }
    .table-container th,
    .table-container td {
      padding: 10px;
      text-align: center;
      border: 1px solid #ddd;
    }
    .table-container th {
      background-color: #2c2c2c;
      color: #fff;
    }
  `}</style>
</section>

      {/*====== End About Section ======*/}
      {/*====== Start Service Section ======*/}
      <section className="service-one dark-black-bg pt-130 pb-125 p-r z-1">
        <div className="shape shape-one">
          <span>
            <img src="assets/images/shape/tree1.png" alt="" />
          </span>
        </div>
        <div className="shape shape-two">
          <span>
            <img src="assets/images/shape/tree2.png" alt="" />
          </span>
        </div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-10 col-lg-10">
              <div className="section-title section-title-white text-center mb-60 wow fadeInUp">
                <span className="sub-title">Oracle Development</span>
                <h2>What We Provide For Your Mining Needs</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-2 col-lg-4 col-md-4 col-sm-12">
              <div className="service-box text-center mb-70 wow fadeInUp">
                <div className="icon">
                  <FaServer />
                </div>
                <div className="text">
                  <h3 className="title">
                    <Link href="/service-details">
                      <a>Reliable Hosting Solutions</a>
                    </Link>
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-xl-2 col-lg-4 col-md-4 col-sm-12">
              <div className="service-box text-center mb-70 wow fadeInDown">
                <div className="icon">
                  <FaTools />
                </div>
                <div className="text">
                  <h3 className="title">
                    <Link href="/service-details">
                      <a>Premium Mining Equipment</a>
                    </Link>
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-xl-2 col-lg-4 col-md-4 col-sm-12">
              <div className="service-box text-center mb-70 wow fadeInUp">
                <div className="icon">
                  <FaChartLine />
                </div>
                <div className="text">
                  <h3 className="title">
                    <Link href="#">
                      <a>Real-Time Data Insights</a>
                    </Link>
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-xl-2 col-lg-4 col-md-4 col-sm-12">
              <div className="service-box text-center mb-70 wow fadeInDown">
                <div className="icon">
                  <FaCalculator />
                </div>
                <div className="text">
                  <h3 className="title">
                    <Link href="#">
                      <a>Mining Profitability Tools</a>
                    </Link>
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-xl-2 col-lg-4 col-md-4 col-sm-12">
              <div className="service-box text-center mb-70 wow fadeInUp">
                <div className="icon">
                  <FaShoppingCart />
                </div>
                <div className="text">
                  <h3 className="title">
                    <Link href="#">
                      <a>Seamless E-Commerce Integration</a>
                    </Link>
                  </h3>
                </div>
              </div>
            </div>
            <div className="col-xl-2 col-lg-4 col-md-4 col-sm-12">
              <div className="service-box text-center mb-70 wow fadeInDown">
                <div className="icon">
                  <FaHeadset />
                </div>
                <div className="text">
                  <h3 className="title">
                    <Link href="#">
                      <a>Expert Customer Support</a>
                    </Link>
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div
                className="play-one_content-box bg_cover wow fadeInDown"
                style={{
                  borderRadius: "30px",
                  backgroundImage: "url(assets/images/bg/customdimvideo.jpg)",
                }}
              >
                <a
                  href="https://www.youtube.com/watch?v=gOZ26jO6iXE"
                  className="video-popup"
                >
                  <i className="fas fa-play" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*====== End Service Section ======*/}
      {/*====== Start Gallery Section ======*/}
      <ProjectOneSlider />
      {/*====== End Gallery Section ======*/}
      {/*====== Start Counter Section ======*/}
      <section className="fun-fact pt-50">
        <div className="big-text mb-40 wow fadeInUp">
          <h2>Statistics</h2>
        </div>
        <h2 className="text-center mb-10">Always Profitable Bitcoin Mining</h2>
        <h4 className="text-center mb-20">
          Secure profitable Bitcoin mining with Oracle Development Group.
        </h4>
        <div className="container">
          <div className="counter-wrap-one wow fadeInDown">
            <div className="counter-inner-box">
              <OrgariumCounter />
            </div>
          </div>
        </div>
      </section>
      {/*====== End Counter Section ======*/}
      {/*====== Start Service Section ======*/}
      {/* <section className="popular-service p-r z-1 pt-130 pb-135">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-10">
              <div className="section-title text-center mb-50 wow fadeInDown">
                <span className="sub-title">Popular Services</span>
                <h2>We Provide Organice Food Services to Get Better Health</h2>
              </div>
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col-lg-4">
              <div className="single-service-item mb-50 wow fadeInUp">
                <div className="icon">
                  <img src="assets/images/icon/icon-1.png" alt="Icon" />
                </div>
                <div className="text">
                  <h3>
                    <Link href="/service-details">
                      <a>Fresh Avocado</a>
                    </Link>
                  </h3>
                  <p>Natus error sit volupt ateme accus antium dolores</p>
                </div>
              </div>
              <div className="single-service-item mb-50 wow fadeInDown">
                <div className="icon">
                  <img src="assets/images/icon/icon-2.png" alt="Icon" />
                </div>
                <div className="text">
                  <h3>
                    <Link href="/service-details">
                      <a>Organic Carrot</a>
                    </Link>
                  </h3>
                  <p>Natus error sit volupt ateme accus antium dolores</p>
                </div>
              </div>
              <div className="single-service-item mb-50 wow fadeInUp">
                <div className="icon">
                  <img src="assets/images/icon/icon-3.png" alt="Icon" />
                </div>
                <div className="text">
                  <h3>
                    <Link href="/service-details">
                      <a>Organic Carrot</a>
                    </Link>
                  </h3>
                  <p>Natus error sit volupt ateme accus antium dolores</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="img-holder mb-50 wow fadeInDown">
                <img
                  src="assets/images/service/img-1.jpg"
                  alt="Service Image"
                  style={{ borderRadius: "30px" }}
                />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="single-service-item mb-50 card-rtl wow fadeInDown">
                <div className="icon">
                  <img src="assets/images/icon/icon-4.png" alt="Icon" />
                </div>
                <div className="text">
                  <h3>
                    <Link href="/service-details">
                      <a>Organic Corn</a>
                    </Link>
                  </h3>
                  <p>Natus error sit volupt ateme accus antium dolores</p>
                </div>
              </div>
              <div className="single-service-item mb-50 card-rtl fadeInUp">
                <div className="icon">
                  <img src="assets/images/icon/icon-5.png" alt="Icon" />
                </div>
                <div className="text">
                  <h3>
                    <Link href="/service-details">
                      <a>Milk and Meats</a>
                    </Link>
                  </h3>
                  <p>Natus error sit volupt ateme accus antium dolores</p>
                </div>
              </div>
              <div className="single-service-item mb-50 card-rtl wow fadeInDown">
                <div className="icon">
                  <img src="assets/images/icon/icon-6.png" alt="Icon" />
                </div>
                <div className="text">
                  <h3>
                    <Link href="/service-details">
                      <a>Fresh Dragon Fruit</a>
                    </Link>
                  </h3>
                  <p>Natus error sit volupt ateme accus antium dolores</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <section>
        <div
          className="container p-20 mb-48"
          style={{ marginBottom: "200px" }}
        ></div>
      </section>
      {/*====== End Service Section ======*/}
      {/*====== Start Fancy Text Block Section ======*/}
      <section className="offer-section-one p-r mb-50  z-2">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div
                className="offer-one_image-box bg_cover mb-50 wow fadeInRight"
                style={{
                  borderRadius: "30px",
                  backgroundImage: "url(assets/images/about/newimage2.jpeg)",
                }}
              >
                <div className="content-box">
                  <h2>60+ Years Of Experience in Mining</h2>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="offer-one_content-box content-box-gap mb-20">
              <div style = {{backgroundColor :'white', paddingLeft: '20px', paddingRight: '20px', paddingBottom: '20px',  borderRadius: '10px'}}>
                <div className="section-title section-title-left mb-20 wow fadeInUp">
                  <span className="sub-title">What We Offers</span>
                  <h2>People Choose Us for Exceptional Mining Solutions</h2>
                </div>
                
                <p style={{color: 'black' }}>
                  At ORACLE Development Group, we take pride in delivering
                  industry-leading crypto mining solutions. From reliable
                  hosting to top-tier equipment, our commitment to excellence
                  ensures our clients achieve maximum profitability and
                  performance in their mining operations.
                </p>
                </div>
               
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*====== End Fancy Text Block Section ======*/}
      {/*====== Start Testimonial Section ======*/}
      <section className="testimonial-one light-gray-bg   p-r z-1">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-10">
              <div className="section-title text-center mb-20 wow fadeInUp">
                <span className="sub-title text-white">Clients Feedback</span>
                <h2 className="text-white">What Others Say About Us</h2>
              </div>
            </div>
          </div>
          <Slider {...testimonialSliderOne} className="testimonial-slider-one">
            <div className="testimonial-item text-center wow fadeInDown">
              {/* <div className="author-thumb">
                <img
                  src="assets/images/testimonial/img-1.jpg"
                  alt="author Image"
                />
              </div> */}
              <div
                className="testimonial-content"
                style={{ borderRadius: "30px" }}
              >
                <p>
                  “I’ve been using ORACLE Development Group for over a year, and
                  their hosting services have exceeded my expectations. The
                  uptime is excellent, and their customer support is always
                  available to help. Highly recommended!”{" "}
                </p>
                <div className="quote">
                  <i className="fas fa-quote-right" />
                </div>
                <div className="author-title">
                  <h4>Michael R. Jordan</h4>
                </div>
              </div>
            </div>
            <div className="testimonial-item text-center wow fadeInUp">
              {/* <div className="author-thumb">
                <img
                  src="assets/images/testimonial/img-2.jpg"
                  alt="author Image"
                />
              </div> */}
              <div className="testimonial-content">
                <p>
                  “I purchased my first mining rig from ORACLE, and it’s been
                  running smoothly ever since. The equipment is high-quality,
                  and the entire process was seamless. Thank you for making
                  crypto mining so accessible!”{" "}
                </p>
                <div className="quote">
                  <i className="fas fa-quote-right" />
                </div>
                <div className="author-title">
                  <h4>Nathan A. Caswell</h4>
                </div>
              </div>
            </div>
            <div className="testimonial-item text-center wow fadeInDown">
              {/* <div className="author-thumb">
                <img
                  src="assets/images/testimonial/img-3.jpg"
                  alt="author Image"
                />
              </div> */}
              <div className="testimonial-content">
                <p>
                  “The live data insights on the ORACLE platform are a
                  game-changer. From BTC market trends to mining difficulty
                  updates, it’s all I need to make informed decisions quickly.”{" "}
                </p>
                <div className="quote">
                  <i className="fas fa-quote-right" />
                </div>
                <div className="author-title">
                  <h4>Somalia D. Silva</h4>
                  {/* <p className="position">Business Manager</p> */}
                </div>
              </div>
            </div>
            <div className="testimonial-item text-center wow fadeInUp">
              {/* <div className="author-thumb">
                <img
                  src="assets/images/testimonial/img-4.jpg"
                  alt="author Image"
                />
              </div> */}
              <div className="testimonial-content">
                <p>
                  “The mining profitability calculator is a lifesaver! It’s
                  accurate and easy to use, helping me optimize my mining
                  strategy for better results. ORACLE Development Group truly
                  understands miners' needs.”{" "}
                </p>
                <div className="quote">
                  <i className="fas fa-quote-right" />
                </div>
                <div className="author-title">
                  <h4>Michael D. Slaughter</h4>
                  {/* <p className="position">Web Developer</p> */}
                </div>
              </div>
            </div>
            <div className="testimonial-item text-center wow fadeInDown">
              {/* <div className="author-thumb">
                <img
                  src="assets/images/testimonial/img-2.jpg"
                  alt="author Image"
                />
              </div> */}
              <div className="testimonial-content">
                <p>
                  “ORACLE’s team is incredibly knowledgeable and responsive.
                  Whenever I had questions about my setup, they guided me
                  through it step by step. The level of service they provide is
                  unmatched.”{" "}
                </p>
                <div className="quote">
                  <i className="fas fa-quote-right" />
                </div>
                <div className="author-title">
                  <h4>Nathan A. Caswell</h4>
                  {/* <p className="position">Senior Manager</p> */}
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </section>
      {/*====== End Testimonial Section ======*/}
      {/*====== Start Contact Section ======*/}
      <section className="contact-one pt-150 p-r z-2">
      <div className="container-fluid">
        <div className="row no-gutters">
          <div className="col-lg-6">
            <div className="contact-one_content-box wow fadeInLeft">
              <div className="contact-wrapper">
                <div className="section-title section-title-left mb-40">
                  <span className="sub-title">Contact Us</span>
                  <h3>
                    Reach out to us now and let’s make your mining goals a
                    reality!
                  </h3>
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
                    {success && <p className="success-text">{success}</p>}
                    <div className="form_group">
                      <button
                        className="main-btn yellow-bg"
                        style={{ color: "white" }}
                      >
                        Send Message
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div
              className="contact-one_information-box bg_cover wow fadeInRight"
              style={{
                borderRadius: "30px",
                backgroundImage: "url(assets/images/bg/miner.png)",
              }}
            >
              <div
                className="information-box"
                style={{ backgroundColor: "white" }}
              >
                <h3>Contact Us</h3>
                <p>
                  Have any questions?
                  <br />
                  Need the assistance of any kind?
                  <br />
                  Start your successful mining today!
                </p>
                <div className="information-item_one d-flex mb-25">
                  <div className="icon">
                    <i className="flaticon-placeholder" />
                  </div>
                  <div className="info">
                    <span className="sub-title mb-1">Location</span>
                    <h5>55 Main Street, New York</h5>
                  </div>
                </div>
                <div className="information-item_one d-flex mb-25">
                  <div className="icon">
                    <i className="flaticon-email" />
                  </div>
                  <div className="info">
                    <span className="sub-title mb-1">Email Address</span>
                    <h5>
                      <a href="mailto:hotline@gmail.com">hotline@gmail.com</a>
                    </h5>
                  </div>
                </div>
                <div className="information-item_one d-flex mb-25">
                  <div className="icon">
                    <i className="flaticon-phone-call" />
                  </div>
                  <div className="info">
                    <span className="sub-title mb-1">Phone Number</span>
                    <h5>
                      <a href="tel:+0123456789">+012(345) 67 89</a>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
      {/*====== End Contact Section ======*/}
      {/*====== Start Blog Section ======*/}
      <section className="blog-section p-r z-1 pt-130 pb-100">
        <div className="container">
          <div className="row align-items-end">
            <div className="col-xl-7 col-lg-10">
              <div className="section-title section-title-left mb-60 wow fadeInLeft">
                <span className="sub-title">Latest News Blog</span>
                <h2>Latest Updates from ORACLE</h2>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="button-box float-lg-right mb-60 wow fadeInRight">
                <Link href="#">
                  <a className="main-btn bordered-btn bordered-yellow">
                    View More Newss
                  </a>
                </Link>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="blog-post-item-one mb-30 wow fadeInLeft">
                <div className="post-thumbnail">
                  <img src="assets/images/blog/news1r.jpg" alt="Post Image" />
                </div>
                <div className="entry-content">
                  <a href="#" className="cat-btn">
                    ORACLE
                  </a>
                  <h3 className="title">
                    <a href="#">
                      Bitcoin Halving Countdown: What It Means for Crypto Miners
                      in 2025
                    </a>
                  </h3>
                  <div className="post-meta">
                    <ul>
                      <li>
                        <span>
                          <i className="far fa-calendar-alt" />
                          <a href="#">25 March 2022</a>
                        </span>
                      </li>
                      <li>
                        <span>
                          <i className="far fa-comments" />
                          <a href="#">Comment (5)</a>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="blog-post-item-one mb-30 wow fadeInRight">
                <div className="post-thumbnail">
                  <img src="assets/images/blog/news2r.jpg" alt="Post Image" />
                </div>
                <div className="entry-content">
                  <a href="#" className="cat-btn">
                    ORACLE
                  </a>
                  <h3 className="title">
                    <a href="#">
                      Top Mining Trends to Watch: Maximizing Profits in a
                      Competitive Market
                    </a>
                  </h3>
                  <div className="post-meta">
                    <ul>
                      <li>
                        <span>
                          <i className="far fa-calendar-alt" />
                          <a href="#">25 March 2022</a>
                        </span>
                      </li>
                      <li>
                        <span>
                          <i className="far fa-comments" />
                          <a href="#">Comment (5)</a>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="blog-post-item-one mb-30 wow fadeInLeft">
                <div className="post-thumbnail">
                  <img src="assets/images/blog/news3r.jpg" alt="Post Image" />
                </div>
                <div className="entry-content">
                  <a href="#" className="cat-btn">
                    ORACLE
                  </a>
                  <h3 className="title">
                    <a href="#">
                      ORACLE Development Group Launches Advanced Mining
                      Profitability Calculator
                    </a>
                  </h3>
                  <div className="post-meta">
                    <ul>
                      <li>
                        <span>
                          <i className="far fa-calendar-alt" />
                          <a href="#">25 March 2022</a>
                        </span>
                      </li>
                      <li>
                        <span>
                          <i className="far fa-comments" />
                          <a href="#">Comment (5)</a>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*====== End Blog Section ======*/}
      {/*====== Start Partner Section ======*/}
      <section className="partners-section  pt-50 pb-60 p-r z-1">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-10">
              <div className="section-title text-center mb-30 wow fadeInUp">
                <h4>We Have More Then 1235+ Global Partners</h4>
              </div>
            </div>
          </div>
          <Slider {...logoSlider} className="partner-slider-one wow fadeInDown">
            <div className="partner-item">
              <div className="partner-img">
                <img
                  src="assets/images/partner/img-1.png"
                  alt="partner image"
                />
              </div>
            </div>
            <div className="partner-item">
              <div className="partner-img">
                <img
                  src="assets/images/partner/img-2.png"
                  alt="partner image"
                />
              </div>
            </div>
            <div className="partner-item">
              <div className="partner-img">
                <img
                  src="assets/images/partner/img-3.png"
                  alt="partner image"
                />
              </div>
            </div>
            <div className="partner-item">
              <div className="partner-img">
                <img
                  src="assets/images/partner/img-4.png"
                  alt="partner image"
                />
              </div>
            </div>
            <div className="partner-item">
              <div className="partner-img">
                <img
                  src="assets/images/partner/img-5.png"
                  alt="partner image"
                />
              </div>
            </div>
            <div className="partner-item">
              <div className="partner-img">
                <img
                  src="assets/images/partner/img-6.png"
                  alt="partner image"
                />
              </div>
            </div>
            <div className="partner-item">
              <div className="partner-img">
                <img
                  src="assets/images/partner/img-3.png"
                  alt="partner image"
                />
              </div>
            </div>
          </Slider>
        </div>
      </section>
      {/*====== End Partner Section ======*/}
      {/*====== Start Footer ======*/}

      {/*====== End Footer ======*/}
      {/*====== back-to-top ======*/}
    </Layout>
  );
};
export default Index;
