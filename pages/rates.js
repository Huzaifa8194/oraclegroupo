import dynamic from "next/dynamic";
import Link from "next/link";
import Slider from "react-slick";
import PageBanner from "../src/components/PageBanner";
import Layout from "../src/layouts/Layout";
import { testimonialSliderThree } from "../src/sliderProps";
import { useEffect } from "react";

import Head from "next/head";

const Counter = dynamic(() => import("../src/components/Counter"), {
  ssr: false,
});
const Farmers = () => {
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
  return (
    <Layout header={4}>


<Head>
      {/* Primary Meta Tags */}
      <title>Custom-Tailored Hosting Rates - Oracle Development Group</title>
      <meta
        name="description"
        content="Get the most competitive hosting rates in the industry with Oracle Development Group. Enjoy fluctuating power rate programs, starting at just $0.069 per kWh, backed by 60+ years of energy expertise."
      />
      <meta
        name="keywords"
        content="crypto mining hosting, hosting rates, cost-effective mining, Oracle Development Group, mining efficiency, best hosting rates"
      />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Oracle Development Group" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://oracledevelopmentgroup.com/farmers" />
      <meta property="og:title" content="Custom-Tailored Hosting Rates - Oracle Development Group" />
      <meta
        property="og:description"
        content="Take advantage of Oracle Development Group's flexible power purchasing solutions for crypto mining. Start with hosting rates as low as $0.069 per kWh."
      />
      <meta property="og:image" content="https://oracledevelopmentgroup.com/assets/images/hosting-rates.jpg" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content="https://oracledevelopmentgroup.com/farmers" />
      <meta name="twitter:title" content="Custom-Tailored Hosting Rates - Oracle Development Group" />
      <meta
        name="twitter:description"
        content="Discover how Oracle Development Group offers the most cost-effective mining hosting solutions with flexible power rates and high efficiency."
      />
      <meta name="twitter:image" content="https://oracledevelopmentgroup.com/assets/images/hosting-rates.jpg" />

      {/* Canonical URL */}
      <link rel="canonical" href="https://oracledevelopmentgroup.com/farmers" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />

      {/* Structured Data (Schema Markup for SEO) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Custom-Tailored Hosting Rates",
          "url": "https://oracledevelopmentgroup.com/farmers",
          "description": "Oracle Development Group provides the most competitive, all-inclusive hosting rates for crypto miners, with power rates as low as $0.069 per kWh.",
          "provider": {
            "@type": "Organization",
            "name": "Oracle Development Group",
            "url": "https://oracledevelopmentgroup.com",
            "logo": "https://oracledevelopmentgroup.com/assets/images/logo.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1-555-123-4567",
              "contactType": "customer service",
              "areaServed": "Global",
              "availableLanguage": ["English"]
            }
          },
          "offers": {
            "@type": "Offer",
            "price": "0.069",
            "priceCurrency": "USD",
            "category": "Hosting Services",
            "url": "https://oracledevelopmentgroup.com/farmers"
          },
          "sameAs": [
            "https://facebook.com/oracledevelopment",
            "https://twitter.com/oracledev",
            "https://linkedin.com/company/oracledevelopment"
          ]
        })}
      </script>
    </Head>
      <PageBanner pageName={"Custom-Tailored Hosting Rates"} />
      {/* <section className="farmers-team_page pt-170 pb-130">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-10">
              <div className="section-title text-center mb-50 wow fadeInUp">
                <span className="sub-title">We Provide</span>
                <h2>Custom-Tailored Hosting Rates</h2>
              </div>
            </div>
          </div>
                    
          <div className="row">
            <div className="col-lg-12">
              <div className="button-box text-center wow fadeInDown">
                <Link href="/farmers">
                  <a className="main-btn bordered-btn bordered-yellow">
                    Become a Member
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      {/*====== End Farmers Section ======*/}
      {/*====== Start Skill Section ======*/}
      <section className="skill-section mt-100 pt-50 pb-90">
        <div className="container-fluid">
        <div
        id = "skillWrapper"
  className="skill-wrapper-one pb-90 bg_cover"
  style={{
    backgroundImage: "url(assets/images/bg/yearsofexp.png)",
    backgroundSize: "cover", // Ensures the image covers the entire div
    backgroundPosition: "center", // Centers the image
    backgroundRepeat: "no-repeat", // Prevents repetition of the image
  }}
>
            <div className="container">
              <div className="row align-items-end">
                <div className="col-lg-5">
                  <div className="skill-one_play-content text-center wow fadeInLeft">
                    <a
                      href="https://www.youtube.com/watch?v=gOZ26jO6iXE"
                      className="video-popup"
                    >
                      <i className="fas fa-play" />
                    </a>
                    <h2>Watch Latest Videos</h2>
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="single-counter-card mb-40 text-left">
                          <div className="text">
                            <h2 className="number">
                              <Counter end={0.069} decimals={3} />
                            </h2>
                            <p>$ per kWh</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="single-counter-card mb-40 text-left">
                          <div className="icon"></div>
                          <div className="text">
                            <h2 className="number">
                              <Counter end={15} />+
                            </h2>
                            <p>Years Of Experience</p>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-6 self-center">
                        <div className="single-counter-card mb-40 text-left">
                          <div className="icon"></div>
                          <div className="text">
                            <h2 className="number">
                              <Counter end={12} />+
                            </h2>
                            <p>Countries</p>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-6 self-center">
                        <div className="single-counter-card mb-40 text-left">
                          <div className="icon"></div>
                          <div className="text">
                            <h2 className="number">
                              <Counter end={25} />+
                            </h2>
                            <p>Partners</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-7">
                  <div className="skill-one_content-box content-box-gap mb-40 wow fadeInRight">
                    <div className="section-title section-title-left mb-30">
                      <h2>Custom-Tailored Hosting Rates</h2>
                    </div>
                    <p style={{fontSize: '1.2em', textAlign: 'justify'}}>
                      At the heart of our mission is providing sustainable and
                      cost-effective power purchasing solutions that translate
                      into the most competitive, all-inclusive hosting rates in
                      the industry. We are proud to be the first and only
                      company offering fluctuating power rate programs, designed
                      to give our clients maximum flexibility and savings.
                      <br />
                      <br />
                      Our hosting rates are fully customized based on your
                      investment, starting as low as $0.069 per kWh, with free
                      setup once your miners arrive at our facility.
                      <br />
                      <br />
                      Efficiency is our priority, and our locations are
                      optimized to deliver the highest performance and
                      reliability. Leading our energy strategy is Mr. Saul
                      Stricker, our Global Energy Efficiency Strategist, who
                      brings over 60 years of expertise in energy optimization,
                      power reliability, and technical consulting across 12
                      countries.
                      <br />
                      <br />
                      With us, you can be confident your operation is supported
                      by industry-leading efficiency and innovation.
                    </p>

                    <div
                      className="skill-button"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "20px", // Spacing between buttons
                        marginTop: "20px", // Optional spacing from the content above
                      }}
                    >
                      <a href="#" className="main-btn bordered-btn">
                        Contact Us
                      </a>

                      <a href="#" className="main-btn bordered-btn">
                        Visit Shop
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*====== End Skill Section ======*/}
      {/*====== Start Testimonial Section ======*/}
      
    </Layout>

    
  );
};
export default Farmers;
