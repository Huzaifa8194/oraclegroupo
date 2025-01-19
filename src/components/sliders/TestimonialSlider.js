import React, { useEffect, useState } from "react";
import Slider from "react-slick";

const TestimonialSlider = () => {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const [slider1, setSlider1] = useState(null);
  const [slider2, setSlider2] = useState(null);
  useEffect(() => {
    setNav1(slider1);
    setNav2(slider2);
  });
  const thumbs = {
    dots: true,
    autoplay: true,
    speed: 800,
    speed: 500,
    arrows: true,
    focusOnSelect: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          arrows: false,
          slidesToShow: 3,
        },
      },
    ],
  };
  const slider = {
    arrows: false,
    dots: false,
    infinite: false,
    autoplay: true,
    speed: 500,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div className="row justify-content-center">
      <div className="col-lg-7">
        <Slider
          {...thumbs}
          asNavFor={nav2}
          ref={(slider) => setSlider1(slider)}
          className="testimonial-thumbs-slider border-bottom-1 mb-60 wow fadeInUp"
        >
          <div className="testimonial-thumb-item">
            <img
              src="assets/images/team/team1.jpeg"
              alt=""
              style={{ height: "150px" }}
            />
          </div>
          <div className="testimonial-thumb-item">
            <img
              src="assets/images/team/team2.jpg"
              alt=""
              style={{ height: "150px" }}
            />
          </div>
          <div className="testimonial-thumb-item">
            <img
              src="assets/images/team/team3.jpeg"
              alt=""
              style={{ height: "150px" }}
            />
          </div>
          <div className="testimonial-thumb-item">
            <img
              src="assets/images/team/team4.jpeg"
              alt=""
              style={{ height: "150px" }}
            />
          </div>
        </Slider>
      </div>
      <div className="col-lg-9">
        <Slider
          {...slider}
          asNavFor={nav1}
          ref={(slider) => setSlider2(slider)}
          className="testimonial-slider-four wow fadeInDown"
        >
          <div className="testimonial-item-three d-flex">
            <div className="author-thumb">
              <img src="assets/images/team/team1.jpeg" alt="" />
            </div>
            <div className="testimonial-content">
              <p>
                From Local Lawns to Global Ventures
                <br />
                <br />
                Lorne’s entrepreneurial journey began with simple yet
                foundational tasks like delivering newspapers and bagging
                groceries, where he developed a strong work ethic and valuable
                business skills. From cutting grass and clearing snow to leading
                large-scale projects, Lorne’s ability to spot and seize
                opportunities has been a key driver of his success.
                <br />
                <br />
                Lorne’s passion for property development came to life with the
                creation of Agua de Lechuga, a condo-hotel in Guanacaste, Costa
                Rica. Through innovative marketing strategies—such as launching
                a rental program and becoming the first to sell condos on eBay
                internationally—he transformed this project into a global
                success.
                <br />
                <br />
                Building on that success, Lorne expanded his real estate
                investments, notably purchasing distressed properties during the
                2008 financial crisis. By personally renovating these
                properties, he turned them into highly profitable rental assets,
                amassing a multimillion-dollar portfolio spanning Detroit,
                Florida, and Mexico.
                <br />
                <br />
                Beyond his achievements in real estate, Lorne has embraced the
                digital world as a crypto enthusiast and miner. His passion for
                innovation allows him to merge traditional investments with
                modern technology seamlessly.
                <br />
                <br />
                Lorne also nurtures a love for cars, combining mechanical
                knowledge with a passion for driving. Whether it’s real estate
                development, cryptocurrency ventures, or personal adventures,
                Lorne approaches each endeavor with creativity, practicality,
                and an unwavering ambition to succeed.

              </p>
              <div className="author-title-qoute d-flex">
                <div className="quote">
                  <i className="fas fa-quote-right" />
                </div>
                <div className="author-title">
                  <h4>Lorne Harari</h4>
                  <p className="position">Founding partner</p>
                </div>
              </div>
            </div>
          </div>
          <div className="testimonial-item-three d-flex">
            <div className="author-thumb">
              <img src="assets/images/team/team2.jpg" alt="" />
            </div>
            <div className="testimonial-content">
              <p>
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
                <div className="quote">
                  <i className="fas fa-quote-right" />
                </div>
                <div className="author-title">
                  <h4>Saul Stricker</h4>
                  <p className="position">
                    Global Energy Efficiency Strategist
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="testimonial-item-three d-flex">
            <div className="author-thumb">
              <img src="assets/images/team/team3.jpeg" alt="" />
            </div>
            <div className="testimonial-content">
              <p>
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
                <div className="quote">
                  <i className="fas fa-quote-right" />
                </div>
                <div className="author-title">
                  <h4>Christopher Bregman</h4>
                  <p className="position">Partner</p>
                </div>
              </div>
            </div>
          </div>
          <div className="testimonial-item-three d-flex">
            <div className="author-thumb">
              <img src="assets/images/team/team4.jpeg" alt="" />
            </div>
            <div className="testimonial-content">
              <p>
                Paul Orsenigo is a seasoned entrepreneur and real estate
                professional with a strong passion for Bitcoin, crypto, and Web
                3.0 technologies. As a licensed realtor with EXP Realty in
                southwest Florida, Paul brings extensive experience in business
                development, negotiation, and strategic planning.
                <br />
                <br />
                Prior to his current role, Paul spent 13 years in Costa Rica,
                where he established himself as a successful broker, builder,
                and owner of Sintesis Interior Design. Notably, he oversaw the
                remodeling at the Grand Papagayo Hotel in Guanacaste, Costa
                Rica.
                <br />
                <br />
                Paul's expertise in Bitcoin and crypto is self-taught, driven by
                his fascination with the potential of decentralized
                technologies. He is bilingual (English and Spanish) and holds a
                strong network of international connections.
                <br />
                <br />
                Currently, Paul is focused on launching a Bitcoin mining
                operation with his partners in Paraguay, leveraging his business
                acumen, crypto expertise, and international experience to drive
                success.
              </p>
              <div className="author-title-qoute d-flex">
                <div className="quote">
                  <i className="fas fa-quote-right" />
                </div>
                <div className="author-title">
                  <h4>Paul Orsenigo</h4>
                  <p className="position">Strategic Consultant</p>
                </div>
              </div>
            </div>
          </div>
        </Slider>
      </div>
    </div>
  );
};
export default TestimonialSlider;
