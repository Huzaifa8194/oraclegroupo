import Link from "next/link";
import Slider from "react-slick";
import OrgariumCounter from "../src/components/OrgariumCounter";
import PageBanner from "../src/components/PageBanner";
import ProgressBar from "../src/components/ProgressBar";
import Layout from "../src/layouts/Layout";
import { logoSlider, testimonialSliderOne } from "../src/sliderProps";
import TestimonialSlider from "../src/components/sliders/TestimonialSlider";
const About = () => {
  return (
    <Layout header={4}>
      <PageBanner pageName={"Who We Are"} />
      <section className="about-section p-r z-1 pt-170 pb-80">
  <div className="container">
    <div className="row">
      <div className="col-lg-6">
        <div className="about-content-box content-box-gap mb-50">
          <div className="section-title section-title-left wow fadeInUp mb-30">
            {/* <span className="sub-title">About Us</span> */}
            <h2>Who We Are</h2>
          </div>
          <p style={{ fontSize: "1.7em", textAlign: "justify" }}>
            Oracle Group was established by a close-knit group of friends from
            the United States and Canada, united by family ties and a strong
            track record in business. Our team brings expertise in real estate
            development, the film industry, and advanced power systems, with
            technical leadership from Saul Stricker. We also provide global
            investment opportunities in the cryptocurrency sector, leveraging
            our diverse skill set and shared vision.
          </p>
        </div>
      </div>
      <div className="col-lg-6">
        <div
          className="about-four_image-box text-right p-r mb-50 wow fadeInRight"
          style={{ marginTop: "20px" }} // Added spacing above the image box
        >
          <img
            src="assets/images/logo/dd.png"
            className="about-img_one"
            alt=""
            style={{
              borderRadius: "40px",
              marginBottom: "20px", // Added spacing below the image
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </div>
      </div>
    </div>
  </div>
</section>

      {/*====== End About Section ======*/}
      {/*====== Start Why choose Section ======*/}
      {/* <section className="why-choose-two p-r z-1 pt-50 pb-90">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-5 col-lg-12">
              <div className="choose-two_content-box">
                <div className="section-title section-title-left mb-40 wow fadeInLeft">
                  <span className="sub-title">Why Choose Us</span>
                  <h2>Very Much Professional Growing Company</h2>
                </div>
              </div>
            </div>
            <div className="col-xl-7 col-lg-12">
              <div className="row pl-lg-70">
                <div className="col-lg-4 col-md-6 col-sm-12">
                  <div className="single-chart-item text-center mb-40 wow fadeInUp">
                    <ProgressBar value={75} color="#eece38" />
                    <div className="text">
                      <h5>Organic Foods Provides</h5>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-12">
                  <div className="single-chart-item text-center mb-40 wow fadeInDown">
                    <ProgressBar value={86} color="#eece38" />
                    <div className="text">
                      <h5>Reforming The Systems</h5>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-12">
                  <div className="single-chart-item text-center mb-40 wow fadeInUp">
                    <ProgressBar value={53} color="#eece38" />
                    <div className="text">
                      <h5>Eco Fridendly Farming</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      {/*====== End Why choose Section ======*/}
      {/* ====== Start Partners Section ======
      <section className="partners-section">
        <div className="container-1350">
          <div className="partners-wrap-two yellow-bg pb-60 pt-50 p-r z-1">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="section-title text-center mb-30 wow fadeInUp">
                  <h4>We Have More Then 1235+ Global Partners</h4>
                </div>
              </div>
            </div>
            <Slider
              {...logoSlider}
              className="partner-slider-one wow fadeInDown"
            >
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
        </div>
      </section>{" "} */}
      {/*====== End Partners Section ======*/}
      {/*====== Start Farmers Section ======*/}
      <section className="farmers-team_two light-gray-bg pb-90">
  <div className="container">
    <div className="row align-items-end">
      <div className="col-lg-8">
        <div className="section-title section-title-left mb-50 wow fadeInLeft">
          <span className="sub-title" style={{ color: "white" }}>
            Our Team
          </span>
          <h2 style={{ color: "white" }}>
            Meet Our Experienced Team Members
          </h2>
        </div>
      </div>
    </div>
    <div className="row justify-content-center">
      {[
        {
          imgSrc: "assets/images/team/team2.jpg",
          name: "Lorne Harari",
          position: "Founding partner",
        },
        {
          imgSrc: "assets/images/team/team1.jpeg",
          name: "Saul Stricker",
          position: "Global Energy Efficiency Strategist",
        },
        {
          imgSrc: "assets/images/team/team3.jpeg",
          name: "Christopher Bregman",
          position: "Partner",
        },
        {
          imgSrc: "assets/images/team/team4.jpeg",
          name: "Paul Orsenigo",
          position: "Strategic Consultant",
        },
      ].map((member, index) => (
        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12" key={index}>
          <div className="team-member_one text-center mb-40 wow fadeInUp">
            <div className="member-img" style={{ overflow: "hidden" }}>
              <img
                src={member.imgSrc}
                alt=""
                style={{
                  height: "250px",
                  width: "250px",
                  objectFit: "cover",
                  borderRadius: "20px",
                }}
              />
            </div>
            <div
              className="member-info"
              style={{
                minHeight: "180px", // Set a fixed height for consistency
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h3 className="title">
                <Link href="/farmers">
                  <a style={{ color: "white" }}>{member.name}</a>
                </Link>
              </h3>
              <p className="position">{member.position}</p>
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
      ))}
    </div>
  </div>
</section>


      {/*====== End Farmers Section ======*/}

      <section className="blog-details-page pt-50 pb-50">
        <div className="container">
          <div className="row">


          <div className="col-xl-4 col-lg-5">
              <div className="sidebar-widget-area">
                <div className="widget author-widget mb-40 wow fadeInUp" style={{color: 'black'}}>
                  <div className="author-content">
                    <img src="assets/images/team/team2.jpg" alt="User Image" />
                    <h4>Lorne Harari</h4>
                    <p>Founding partner</p>
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
                          <i className="fab fa-linkedin-in" />
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
            <div className="col-xl-8 col-lg-7">
              <div className="blog-details-wrapper mb-40 wow fadeInUp">
                <div className="blog-post-item">
                  
                  <div className="post-content">
                   
                    <p style={{ fontSize: "1.3em", color: "black" }}>

                      <strong>From Local Lawns to Global Ventures</strong>
                      <br/><br/>
                      
                      Lorne’s entrepreneurial journey began with simple yet
                      foundational tasks like delivering newspapers and bagging
                      groceries, where he developed a strong work ethic and
                      valuable business skills. From cutting grass and clearing
                      snow to leading large-scale projects, Lorne’s ability to
                      spot and seize opportunities has been a key driver of his
                      success.
                      <br />
                      <br />
                      Lorne’s passion for property development came to life with
                      the creation of Agua de Lechuga, a condo-hotel in
                      Guanacaste, Costa Rica. Through innovative marketing
                      strategies—such as launching a rental program and becoming
                      the first to sell condos on eBay internationally—he
                      transformed this project into a global success.
                      <br />
                      <br />
                      Building on that success, Lorne expanded his real estate
                      investments, notably purchasing distressed properties
                      during the 2008 financial crisis. By personally renovating
                      these properties, he turned them into highly profitable
                      rental assets, amassing a multimillion-dollar portfolio
                      spanning Detroit, Florida, and Mexico.
                      <br />
                      <br />
                      Beyond his achievements in real estate, Lorne has embraced
                      the digital world as a crypto enthusiast and miner. His
                      passion for innovation allows him to merge traditional
                      investments with modern technology seamlessly.
                      <br />
                      <br />
                      Lorne also nurtures a love for cars, combining mechanical
                      knowledge with a passion for driving. Whether it’s real
                      estate development, cryptocurrency ventures, or personal
                      adventures, Lorne approaches each endeavor with
                      creativity, practicality, and an unwavering ambition to
                      succeed.
                    </p>
                    <div className="author-title-qoute d-flex">
                      <div className="author-title">
                        <h4>Lorne Harari</h4>
                        <p className="position">Founding partner</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


           








            <div className="col-xl-4 col-lg-5">
              <div className="sidebar-widget-area">
                <div className="widget author-widget mb-40 wow fadeInUp">
                  <div className="author-content">
                    <img src="assets/images/team/team1.jpeg" alt="User Image" />
                    <h4>Paul Orsenigo</h4>
                    <p>Strategic Consultant</p>
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
                          <i className="fab fa-linkedin-in" />
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


            <div className="col-xl-8 col-lg-7">
              <div className="blog-details-wrapper mb-40 wow fadeInUp">
                <div className="blog-post-item">
                  <div className="post-content">
                   
                    <p style={{ fontSize: "1.3em", color: "black" }}>
                      Paul Orsenigo is a seasoned entrepreneur and real estate
                      professional with a strong passion for Bitcoin, crypto,
                      and Web 3.0 technologies. As a licensed realtor with EXP
                      Realty in southwest Florida, Paul brings extensive
                      experience in business development, negotiation, and
                      strategic planning.
                      <br />
                      <br />
                      Prior to his current role, Paul spent 13 years in Costa
                      Rica, where he established himself as a successful broker,
                      builder, and owner of Sintesis Interior Design. Notably,
                      he oversaw the remodeling at the Grand Papagayo Hotel in
                      Guanacaste, Costa Rica.
                      <br />
                      <br />
                      Paul's expertise in Bitcoin and crypto is self-taught,
                      driven by his fascination with the potential of
                      decentralized technologies. He is bilingual (English and
                      Spanish) and holds a strong network of international
                      connections.
                      <br />
                      <br />
                      Currently, Paul is focused on launching a Bitcoin mining
                      operation with his partners in Paraguay, leveraging his
                      business acumen, crypto expertise, and international
                      experience to drive success.
                    </p>
                    <div className="author-title-qoute d-flex">
                      <div className="author-title">
                        <h4>Paul Orsenigo</h4>
                        <p className="position">Strategic Consultant</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

         









            <div className="col-xl-4 col-lg-5">
              <div className="sidebar-widget-area">
                <div className="widget author-widget mb-40 wow fadeInUp">
                  <div className="author-content">
                    <img src="assets/images/team/team3.jpeg" alt="User Image" />
                    <h4>Saul Stricker</h4>
                    <p> Global Energy Efficiency Strategist</p>
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
                          <i className="fab fa-linkedin-in" />
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



            <div className="col-xl-8 col-lg-7">
              <div className="blog-details-wrapper mb-40 wow fadeInUp">
                <div className="blog-post-item">
                  <div className="post-content">
                   
                    <p style={{ fontSize: "1.3em", color: "black" }}>
                    With over 60 years of experience in energy efficiency, power
                reliability, and technical consulting across 12 countries, Saul
                Stricker is a trailblazer in developing innovative solutions for
                energy optimization and infrastructure challenges.
                <br />
                <br />
                <strong>Career Highlights</strong>
                <br />
                Pioneering Interruptible Power Solutions: <br></br>While working
                with Ontario Hydro (now Hydro One) in Canada, Saul played a key
                role in designing a groundbreaking program for “interruptible
                power.” This initiative allowed the utility to optimize energy
                usage during off-peak periods by leveraging surplus
                hydroelectric power from Niagara Falls, enabling system
                expansion and reducing costs.
                <br />
                <br /> Global Impact in Energy Consulting:
                <br />
                Saul’s expertise has been sought worldwide. For instance, he was
                invited by the National Electric Utility of Egypt to address
                widespread blackouts impacting seven interconnected countries.
                His strategy to shift major loads to off-peak hours using
                interruptible power not only restored grid stability but also
                significantly lowered costs for both utilities and large-scale
                consumers.
                <br />
                <br />
                Policy Innovation for Energy Efficiency:
                <br /> Saul’s work in developing programs such as Canada’s
                ENERGUIDE Labeling Program has improved product efficiency and
                supported local manufacturing competitiveness. His ability to
                align energy strategies with economic growth makes his expertise
                particularly valuable in emerging markets, such as Paraguay,
                where his solutions could elevate manufacturing standards and
                reduce operational expenses.
                <br />
                <br />
                <strong>Commitment to Service</strong>
                <br />
                <br />
                Beyond his professional achievements, Saul is deeply committed
                to giving back to communities and making a positive impact on
                humanity. His passion for innovative energy solutions is matched
                by his dedication to creating sustainable and equitable outcomes
                for people and businesses alike.
                <br />
                <br />
                Saul Stricker’s legacy is one of leadership, vision, and a
                relentless drive to advance energy efficiency on a global scale.
                    </p>
                    <div className="author-title-qoute d-flex">
                      <div className="author-title">
                        <h4>Saul Stricker</h4>
                        <p className="position"> Global Energy Efficiency Strategist</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          


















            <div className="col-xl-4 col-lg-5">
              <div className="sidebar-widget-area">
                <div className="widget author-widget mb-40 wow fadeInUp">
                  <div className="author-content">
                    <img src="assets/images/team/team4.jpeg" alt="User Image" />
                    <h4>Christopher Bregman</h4>
                    <p>Partner</p>
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
                          <i className="fab fa-linkedin-in" />
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




            <div className="col-xl-8 col-lg-7">
              <div className="blog-details-wrapper mb-40 wow fadeInUp">
                <div className="blog-post-item">
                  <div className="post-content">
                   
                    <p style={{ fontSize: "1.3em", color: "black" }}>
                    Christopher Bregman is a multifaceted professional with a
                diverse background in acting, directing, and real estate. Born
                and raised in New York City, Christopher has always been drawn
                to the world of entertainment and business.
                <br />
                <br />
                As the son of legendary film producer Martin Bregman, who
                brought iconic films like Scarface to the big screen,
                Christopher grew up surrounded by the excitement and creativity
                of the film industry. He has carried on his family's legacy
                through his own work in acting and directing.
                <br />
                <br />
                In addition to his work in entertainment, Christopher has also
                established himself as a successful real estate professional in
                New York City. His unique blend of creative vision and business
                acumen has allowed him to thrive in both industries.
                <br />
                <br />
                Currently, Christopher is investing in a cutting-edge Bitcoin
                mining facility, further expanding his portfolio and exploring
                new opportunities in the rapidly evolving world of
                cryptocurrency.
                <br />
                <br />
                With his diverse experience, industry connections, and passion
                for innovation, Christopher brings a unique perspective and
                expertise to the table.
                    </p>
                    <div className="author-title-qoute d-flex">
                      <div className="author-title">
                        <h4>Christopher Bregman</h4>
                        <p className="position">Partner</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

        









          </div>
        </div>
      </section>











      {/* <section className="testimonial-three pt-130 pb-0">
        <div className="container">
          <TestimonialSlider />
        </div>
      </section> */}
      {/*====== Start Testimonial Section ======*/}
      {/* <section className="testimonial-section pt-130">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-10">
              <div className="section-title text-center mb-60 wow fadeInUp">
                <span className="sub-title">Clients Feedback</span>
                <h2>What’s Our Clients Say About Our Organic Foods</h2>
              </div>
            </div>
          </div>
          <Slider {...testimonialSliderOne} className="testimonial-slider-one">
            <div className="testimonial-item text-center wow fadeInDown">
              <div className="author-thumb">
                <img
                  src="assets/images/testimonial/img-1.jpg"
                  alt="author Image"
                />
              </div>
              <div className="testimonial-content">
                <p>
                  “Sit amet consectetu escing elit sed do eiusmod tempor
                  incididunt ut labore dolore magna aliqua. Quis ipsum
                  suspendisse ultrices gravic darisus comoe”{" "}
                </p>
                <div className="quote">
                  <i className="fas fa-quote-right" />
                </div>
                <div className="author-title">
                  <h4>Michael R. Jordan</h4>
                  <p className="position">CEO &amp; Founder</p>
                </div>
              </div>
            </div>
            <div className="testimonial-item text-center wow fadeInUp">
              <div className="author-thumb">
                <img
                  src="assets/images/testimonial/img-2.jpg"
                  alt="author Image"
                />
              </div>
              <div className="testimonial-content">
                <p>
                  “Sit amet consectetu escing elit sed do eiusmod tempor
                  incididunt ut labore dolore magna aliqua. Quis ipsum
                  suspendisse ultrices gravic darisus comoe”{" "}
                </p>
                <div className="quote">
                  <i className="fas fa-quote-right" />
                </div>
                <div className="author-title">
                  <h4>Nathan A. Caswell</h4>
                  <p className="position">Senior Manager</p>
                </div>
              </div>
            </div>
            <div className="testimonial-item text-center wow fadeInDown">
              <div className="author-thumb">
                <img
                  src="assets/images/testimonial/img-3.jpg"
                  alt="author Image"
                />
              </div>
              <div className="testimonial-content">
                <p>
                  “Sit amet consectetu escing elit sed do eiusmod tempor
                  incididunt ut labore dolore magna aliqua. Quis ipsum
                  suspendisse ultrices gravic darisus comoe”{" "}
                </p>
                <div className="quote">
                  <i className="fas fa-quote-right" />
                </div>
                <div className="author-title">
                  <h4>Somalia D. Silva</h4>
                  <p className="position">Business Manager</p>
                </div>
              </div>
            </div>
            <div className="testimonial-item text-center wow fadeInUp">
              <div className="author-thumb">
                <img
                  src="assets/images/testimonial/img-4.jpg"
                  alt="author Image"
                />
              </div>
              <div className="testimonial-content">
                <p>
                  “Sit amet consectetu escing elit sed do eiusmod tempor
                  incididunt ut labore dolore magna aliqua. Quis ipsum
                  suspendisse ultrices gravic darisus comoe”{" "}
                </p>
                <div className="quote">
                  <i className="fas fa-quote-right" />
                </div>
                <div className="author-title">
                  <h4>Michael D. Slaughter</h4>
                  <p className="position">Web Developer</p>
                </div>
              </div>
            </div>
            <div className="testimonial-item text-center wow fadeInDown">
              <div className="author-thumb">
                <img
                  src="assets/images/testimonial/img-2.jpg"
                  alt="author Image"
                />
              </div>
              <div className="testimonial-content">
                <p>
                  “Sit amet consectetu escing elit sed do eiusmod tempor
                  incididunt ut labore dolore magna aliqua. Quis ipsum
                  suspendisse ultrices gravic darisus comoe”{" "}
                </p>
                <div className="quote">
                  <i className="fas fa-quote-right" />
                </div>
                <div className="author-title">
                  <h4>Nathan A. Caswell</h4>
                  <p className="position">Senior Manager</p>
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </section> */}
      {/*====== End Testimonial Section ======*/}
      {/*====== Start Counter Section ======*/}
      {/* <section className="fun-fact-one pt-30 pb-130">
        <div className="big-text mb-75 wow fadeInUp">
          <h2>Statistics</h2>
        </div>
        <div className="container">
          <div className="counter-wrap-one wow fadeInDown">
            <div className="counter-inner-box">
              <OrgariumCounter />
            </div>
          </div>
        </div>
      </section> */}
    </Layout>
  );
};
export default About;
