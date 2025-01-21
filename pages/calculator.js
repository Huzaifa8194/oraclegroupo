import dynamic from "next/dynamic";
import Link from "next/link";
import PageBanner from "../src/components/PageBanner";
import Layout from "../src/layouts/Layout";
import { useState, useEffect } from "react";

const Counter = dynamic(() => import("../src/components/Counter"), {
  ssr: false,
});

const MiningCalculator = () => {
  const [hashRate, setHashRate] = useState("");
  const [profitability, setProfitability] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const updateBackground = () => {
      const skillWrapper = document.getElementById("skillWrapper");
      if (window.innerWidth < 1000) {
        skillWrapper.style.backgroundImage = "none";
        skillWrapper.style.backgroundColor = "#1F1E17";
      } else {
        skillWrapper.style.backgroundImage =
          "url(assets/images/bg/yearsofexp.png)";
        skillWrapper.style.backgroundColor = "transparent";
      }
    };

    // Run on load
    updateBackground();

    // Add event listener for resize
    window.addEventListener("resize", updateBackground);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", updateBackground);
    };
  }, []);

  const fetchProfitability = async () => {
    setError(null);
    if (!hashRate) {
      setError("Please enter a valid hash rate.");
      return;
    }

    try {
      const response = await fetch(
        `https://api2.nicehash.com/main/api/v2/mining/algorithms`
      );
      const data = await response.json();

      if (response.ok) {
        const sha256Algorithm = data.algorithms.find(
          (algo) => algo.algorithm === "SHA256"
        );

        if (sha256Algorithm) {
          const dailyProfitability =
            sha256Algorithm.payingRate * parseFloat(hashRate);
          setProfitability(dailyProfitability.toFixed(2));
        } else {
          setError("Algorithm data not found.");
        }
      } else {
        setError("Failed to fetch profitability data.");
      }
    } catch (err) {
      setError("An error occurred while fetching data.");
    }
  };

  return (
    <Layout header={4}>
      <PageBanner pageName={"Mining Profitability Calculator"} />

      <section className="skill-section mt-100 pt-50 pb-90">
        <div className="container-fluid">
          <div
            id="skillWrapper"
            className="skill-wrapper-one pb-90 bg_cover"
            style={{
              backgroundImage: "url(assets/images/bg/yearsofexp.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <div className="skill-one_content-box content-box-gap mb-40 wow fadeInLeft">
                    <div className="section-title section-title-left mb-30">
                      <h2>Calculate Mining Profitability</h2>
                    </div>
                    <p style={{ fontSize: "1.2em", textAlign: "justify" }}>
                      Use our calculator to estimate your daily mining
                      profitability based on your hash rate and the latest data
                      from NiceHash.
                    </p>
                    <div className="form-group mt-4">
                      <label htmlFor="hashRate" style={{ fontWeight: "bold" }}>
                        Enter Hash Rate (TH/s):
                      </label>
                      <input
                        type="number"
                        id="hashRate"
                        className="form-control"
                        value={hashRate}
                        onChange={(e) => setHashRate(e.target.value)}
                        placeholder="e.g., 100"
                        style={{
                          marginTop: "10px",
                          padding: "10px",
                          borderRadius: "5px",
                        }}
                      />
                    </div>
                    <button
                      onClick={fetchProfitability}
                      className="main-btn bordered-btn mt-3"
                    >
                      Calculate Profitability
                    </button>
                    {error && (
                      <div
                        className="error-message mt-3"
                        style={{ color: "red" }}
                      >
                        {error}
                      </div>
                    )}
                    {profitability && (
                      <div
                        className="result-message mt-3"
                        style={{ color: "green" }}
                      >
                        <h3>Estimated Daily Profitability: ${profitability}</h3>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="skill-one_play-content text-center wow fadeInRight">
                    <h2>Latest Mining Updates</h2>
                    <p>
                      Stay updated with current mining rates and profitability
                      trends for maximum returns.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MiningCalculator;
