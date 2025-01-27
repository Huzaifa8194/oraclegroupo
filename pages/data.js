"use client";

import React, { useEffect, useState, useRef } from "react";
import Layout from "../src/layouts/Layout";
import PageBanner from "../src/components/PageBanner";

const CryptoDataPage = () => {
  const [marketCap, setMarketCap] = useState(null);
  const [btcVolume, setBtcVolume] = useState(null);
  const [miningDifficulty, setMiningDifficulty] = useState(null);
  const [btcPrice, setBtcPrice] = useState(null);
  const [btcDominance, setBtcDominance] = useState(null);
  const [btcMarketCap, setBtcMarketCap] = useState(null);
  const [remainingTime, setRemainingTime] = useState("");
  const [btcPriceTable, setBtcPriceTable] = useState([]);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null); // Ref to manage the countdown timer

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Fetch global data from CoinGecko API
        const coingeckoResponse = await fetch("https://api.coingecko.com/api/v3/global");
        const coingeckoData = await coingeckoResponse.json();

        const totalMarketCap = coingeckoData.data.total_market_cap.usd || "N/A";
        const totalBTCVolume = coingeckoData.data.total_volume.usd || "N/A";
        const btcMarketCapValue = coingeckoData.data.market_cap_percentage.btc || "N/A";
        const btcDominanceValue = coingeckoData.data.market_cap_percentage.btc || "N/A";

        setMarketCap(`$${totalMarketCap.toLocaleString()}`);
        setBtcVolume(`$${totalBTCVolume.toLocaleString()}`);
        setBtcMarketCap(`${btcMarketCapValue.toFixed(2)}%`);
        setBtcDominance(`${btcDominanceValue.toFixed(2)}%`);

        // Fetch mining difficulty from Blockchain.com API
        const blockchainResponse = await fetch("https://blockchain.info/q/getdifficulty");
        const miningDifficultyData = await blockchainResponse.text();
        setMiningDifficulty(parseFloat(miningDifficultyData).toFixed(2));

        // Fetch live Bitcoin price from CoinCap API
        const btcPriceResponse = await fetch("https://api.coincap.io/v2/assets/bitcoin");
        const btcPriceData = await btcPriceResponse.json();
        setBtcPrice(`$${parseFloat(btcPriceData.data.priceUsd).toLocaleString()}`);

        // Fetch historical Bitcoin prices with a large date range
        const priceResponse = await fetch(
          "https://api.coincap.io/v2/assets/bitcoin/history?interval=d1&start=1262304000000&end=" +
            Date.now()
        ); // Start from Jan 1, 2010 (timestamp: 1262304000000)
        const priceData = await priceResponse.json();

        if (priceData.data) {
          const yearlyData = processYearlyData(priceData.data);
          setBtcPriceTable(yearlyData);
        }

        // Fetch current block height for halving countdown
        const blockHeightResponse = await fetch("https://blockchain.info/q/getblockcount");
        const currentBlockHeight = await blockHeightResponse.text();

        const halvingInterval = 210000;
        const nextHalvingBlock = Math.ceil(currentBlockHeight / halvingInterval) * halvingInterval;
        const blocksToNextHalving = nextHalvingBlock - currentBlockHeight;
        const averageBlockTime = 10 * 60 * 1000; // 10 minutes in milliseconds
        const nextHalvingDate = new Date(Date.now() + blocksToNextHalving * averageBlockTime);

        // Start the countdown timer
        startCountdown(nextHalvingDate);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    const processYearlyData = (data) => {
      const groupedByYear = {};

      data.forEach((entry) => {
        const date = new Date(entry.time);
        const year = date.getFullYear();
        const price = parseFloat(entry.priceUsd);

        if (!groupedByYear[year]) {
          groupedByYear[year] = {
            year,
            janFirstPrice: null,
            decLastPrice: null,
            totalPrices: 0,
            priceCount: 0,
          };
        }

        // Assign price for January 1st
        if (date.getMonth() === 0 && date.getDate() === 1) {
          groupedByYear[year].janFirstPrice = price;
        }

        // Assign price for December 31st
        if (date.getMonth() === 11 && date.getDate() === 31) {
          groupedByYear[year].decLastPrice = price;
        }

        // Accumulate total prices and count for average calculation
        groupedByYear[year].totalPrices += price;
        groupedByYear[year].priceCount++;
      });

      // Calculate final data structure
      const yearlyData = Object.values(groupedByYear).map((yearData, index, array) => {
        const avgPrice =
          yearData.totalPrices && yearData.priceCount
            ? (yearData.totalPrices / yearData.priceCount).toFixed(2)
            : "N/A";

        const prevYearData = array[index - 1];
        const prevDecLastPrice = prevYearData?.decLastPrice || null;

        // Calculate YoY % change
        const percentChangeYoY =
          prevDecLastPrice && yearData.janFirstPrice
            ? (((yearData.janFirstPrice - prevDecLastPrice) / prevDecLastPrice) * 100).toFixed(2)
            : "N/A";

        return {
          year: yearData.year,
          janFirstPrice: yearData.janFirstPrice ? `$${yearData.janFirstPrice.toFixed(2)}` : "N/A",
          decLastPrice: yearData.decLastPrice ? `$${yearData.decLastPrice.toFixed(2)}` : "N/A",
          avgPrice: avgPrice ? `$${avgPrice}` : "N/A",
          percentChangeYoY: percentChangeYoY !== "N/A" ? `${percentChangeYoY}%` : "N/A",
        };
      });

      return yearlyData;
    };

    const startCountdown = (halvingDate) => {
      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

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
          clearInterval(timerRef.current); // Stop the timer
        }
      }, 1000);
    };

    fetchData();

    // Cleanup interval on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <Layout header={4}>
      <PageBanner pageName="Bitcoin Data" />
      <section className="crypto-data-section pt-130 pb-80">
        <div className="container">
          {/* Yearly Bitcoin Price Data Table */}
          <div className="row mt-5">
            <div className="col-12">
              <h3 className="text-center mb-4">Bitcoin Yearly Price Data</h3>
              <div className="table-container">
                {loading ? (
                  <p className="text-center">Loading data...</p>
                ) : (
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Year</th>
                        <th>Price on Jan 1st</th>
                        <th>Price on Dec 31st</th>
                        <th>Avg. Price</th>
                        <th>% Change YoY</th>
                      </tr>
                    </thead>
                    <tbody>
                      {btcPriceTable.map((row, index) => (
                        <tr key={index}>
                          <td>{row.year}</td>
                          <td>{row.janFirstPrice}</td>
                          <td>{row.decLastPrice}</td>
                          <td>{row.avgPrice}</td>
                          <td>{row.percentChangeYoY}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CryptoDataPage;
