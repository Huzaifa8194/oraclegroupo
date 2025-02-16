"use client";

import React, { useState } from "react";
import Layout from "../src/layouts/Layout";
import { toast } from "react-toastify";

import Head from "next/head";
const ProfitabilityCalculator = () => {
  const [hashrate, setHashrate] = useState("");
  const [unit, setUnit] = useState("MH");
  const [algorithm, setAlgorithm] = useState("sha256");
  const [powerConsumption, setPowerConsumption] = useState("");
  const [electricityCost, setElectricityCost] = useState("");
  const [poolFee, setPoolFee] = useState("");
  const [btcPrice, setBtcPrice] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [profit, setProfit] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBitcoinData = async () => {
    try {
      setLoading(true);

      const priceResponse = await fetch('/api/nicehash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getBitcoinPrice' }),
      });
      const priceData = await priceResponse.json();
      setBtcPrice(priceData.usd);

      const difficultyResponse = await fetch('/api/nicehash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getMiningDifficulty' }),
      });
      const difficultyData = await difficultyResponse.json();
      setDifficulty(difficultyData.difficulty);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const calculateProfitability = async () => {
    if (
      !hashrate ||
      !btcPrice ||
      !difficulty ||
      !algorithm ||
      !unit ||
      !powerConsumption ||
      !electricityCost ||
      !poolFee
    ) {
      toast.error("Please ensure all fields are filled.");
      return;
    }

    try {
      const response = await fetch('/api/nicehash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'calculateProfitability',
          payload: {
            hashrate: parseFloat(hashrate),
            btcPrice,
            networkDifficulty: difficulty,
            algorithm,
            unit,
            powerConsumption: parseFloat(powerConsumption),
            electricityCost: parseFloat(electricityCost),
            poolFee: parseFloat(poolFee),
          },
        }),
      });
      const data = await response.json();
      setProfit(data);
    } catch (error) {
      console.error("Error calculating profitability:", error);
    }
  };
  const pageUrl = "https://oracledevelopmentgroup.com/profitability-calculator";

  return (
    <Layout header = {4}>
    
    <Head>
      {/* Dynamic Title */}
      <title>Crypto Mining Profitability Calculator | BTC Mining ROI</title>

      {/* Meta Description */}
      <meta
        name="description"
        content="Calculate your Bitcoin and crypto mining profitability with our easy-to-use profitability calculator. Estimate earnings, electricity costs, and net profits in real-time."
      />

      {/* Meta Keywords */}
      <meta
        name="keywords"
        content="crypto mining calculator, bitcoin mining profitability, BTC miner ROI, mining profit estimator, electricity cost calculator, Ethereum mining calculator, SHA-256 mining earnings"
      />
      
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Oracle Development Group" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content="Crypto Mining Profitability Calculator | BTC Mining ROI" />
      <meta property="og:description" content="Easily calculate your crypto mining profitability, BTC earnings, and electricity costs with our advanced profitability calculator. Try it now!" />
      <meta property="og:image" content="https://oracledevelopmentgroup.com/assets/images/mining-calculator.jpg" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content="Crypto Mining Profitability Calculator | BTC Mining ROI" />
      <meta name="twitter:description" content="Use our mining profitability calculator to estimate BTC and crypto mining earnings, electricity expenses, and net profits. Try now!" />
      <meta name="twitter:image" content="https://oracledevelopmentgroup.com/assets/images/mining-calculator.jpg" />

      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />

      {/* Structured Data (Schema Markup for SEO) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "WebPage",
          "name": "Crypto Mining Profitability Calculator",
          "url": pageUrl,
          "description": "Calculate your crypto mining profitability with our advanced mining profitability calculator. Estimate BTC earnings, electricity costs, and net profits instantly.",
          "publisher": {
            "@type": "Organization",
            "name": "Oracle Development Group",
            "url": "https://oracledevelopmentgroup.com",
            "logo": {
              "@type": "ImageObject",
              "url": "https://oracledevelopmentgroup.com/assets/images/logo.png"
            }
          },
          "mainEntity": {
            "@type": "SoftwareApplication",
            "name": "Crypto Mining Profitability Calculator",
            "applicationCategory": "FinancialApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0.00",
              "priceCurrency": "USD"
            }
          }
        })}
      </script>
    </Head>
    <div className = "container mt-100 mb-100 pb-80"> <h2>Use our mining profitability Calculator</h2>
    <div className="calculator-container">
      
      <div className="calculator-content">
        <h1 className="calculator-title">Mining Profitability Calculator</h1>

        <button
          onClick={fetchBitcoinData}
          disabled={loading}
          className="primary-btn"
        >
          {loading ? "Loading..." : "Load Bitcoin Data"}
        </button>

        {btcPrice && <p className="data-info">Current BTC Price: ${btcPrice.toLocaleString()}</p>}
        {difficulty && <p className="data-info">Network Difficulty: {difficulty.toLocaleString()}</p>}

        <div className="form-grid">
          <div className="form-group">
            <label>Enter Hashrate:</label>
            <input
              type="number"
              value={hashrate}
              onChange={(e) => setHashrate(e.target.value)}
              className="input-field"
              placeholder="e.g., 100"
            />
          </div>
          <div className="form-group">
            <label>Select Unit:</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="select-field"
            >
              <option value="H">H/s</option>
              <option value="kH">kH/s</option>
              <option value="MH">MH/s</option>
              <option value="GH">GH/s</option>
              <option value="TH">TH/s</option>
            </select>
          </div>
          <div className="form-group">
            <label>Select Algorithm:</label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="select-field"
            >
              <option value="sha256">SHA-256 (Bitcoin)</option>
              <option value="ethash">Ethash (Ethereum)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Power Consumption (W):</label>
            <input
              type="number"
              value={powerConsumption}
              onChange={(e) => setPowerConsumption(e.target.value)}
              className="input-field"
              placeholder="e.g., 3000"
            />
          </div>
          <div className="form-group">
            <label>Electricity Cost (USD per kWh):</label>
            <input
              type="number"
              value={electricityCost}
              onChange={(e) => setElectricityCost(e.target.value)}
              className="input-field"
              placeholder="e.g., 0.10"
            />
          </div>
          <div className="form-group">
            <label>Pool Fee (%):</label>
            <input
              type="number"
              value={poolFee}
              onChange={(e) => setPoolFee(e.target.value)}
              className="input-field"
              placeholder="e.g., 1"
            />
          </div>
        </div>

        <button onClick={calculateProfitability} className="primary-btn">
          Calculate Profitability
        </button>

        {profit && (
          <div className="results-container">
            <h2 className="results-title">Profitability Results:</h2>
            <p>BTC per day: {profit.btcPerDay.toFixed(8)}</p>
            <p>Gross Revenue (USD): ${profit.grossRevenue.toFixed(2)}</p>
            <p>Electricity Cost (USD): ${profit.dailyElectricityCost.toFixed(2)}</p>
            <p>Pool Fee (USD): ${profit.poolFeeAmount.toFixed(2)}</p>
            <p>Net Profit (USD): ${profit.netProfit.toFixed(2)}</p>
          </div>
        )}
      </div>
      </div>
    </div>
    </Layout>
  );
};

export default ProfitabilityCalculator;
