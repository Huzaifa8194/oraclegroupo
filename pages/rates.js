import dynamic from "next/dynamic";
import Link from "next/link";
import Slider from "react-slick";
import PageBanner from "../src/components/PageBanner";
import Layout from "../src/layouts/Layout";
import { testimonialSliderThree } from "../src/sliderProps";

const Counter = dynamic(() => import("../src/components/Counter"), {
  ssr: false,
});
const Farmers = () => {
  return (
    <Layout header= {4}>
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
      <section className="skill-section mt-100 pt-130 pb-90">
        <div className="container-fluid">
          <div
            className="skill-wrapper-one pb-90 bg_cover"
            style={{ backgroundImage: "url(assets/images/bg/yearsofexp.png)" }}
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
                              <Counter end={60} />+
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
                    </div>
                  </div>
                </div>
                <div className="col-lg-7">
                  <div className="skill-one_content-box content-box-gap mb-40 wow fadeInRight">
                    <div className="section-title section-title-left mb-30">
                      <h2>Custom-Tailored Hosting Rates</h2>
                    </div>
                    <p>
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

                      <br/>
                      <br/>
                      With us, you can be confident your operation is supported by industry-leading efficiency and innovation.
                    </p>
                   
                  
                    <div className="skill-button">
                      <a href="#" className="main-btn bordered-btn">
                       Contact Us
                      </a>

                      <a href="#" className="main-btn bordered-btn ml-10">
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
