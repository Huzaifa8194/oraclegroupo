import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import PreLoader from "../src/layouts/PreLoader";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import Toast styles
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 1000);
  }, []);

  return (
    <Fragment>
      <Head>
        <title>Oracle Development Group</title>
        {/*====== Favicon Icon ======*/} 
        <link
          rel="shortcut icon"
          href="assets/images/favicon.ico"
          type="image/png"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Anek+Latin:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/*====== FontAwesome css ======*/} 
        <link
          rel="stylesheet"
          href="assets/fonts/fontawesome/css/all.min.css"
        />
        {/*====== Flaticon css ======*/} 
        <link rel="stylesheet" href="assets/fonts/flaticon/flaticon.css" />
        {/*====== Bootstrap css ======*/} 
        <link
          rel="stylesheet"
          href="assets/vendor/bootstrap/css/bootstrap.min.css"
        />
        {/*====== magnific-popup css ======*/} 
        <link
          rel="stylesheet"
          href="assets/vendor/magnific-popup/dist/magnific-popup.css"
        />
        {/*====== Slick-popup css ======*/} 
        <link rel="stylesheet" href="assets/vendor/slick/slick.css" />
        {/*====== Nice Select css ======*/} 
        <link
          rel="stylesheet"
          href="assets/vendor/nice-select/css/nice-select.css"
        />
        {/*====== Animate css ======*/} 
        <link rel="stylesheet" href="assets/vendor/animate.css" />
        {/*====== Default css ======*/} 
        <link rel="stylesheet" href="assets/css/default.css" />
        {/*====== Style css ======*/} 
        <link rel="stylesheet" href="assets/css/style.css" />
      </Head>

      {/* Show PreLoader while the app is loading */}
      {loader && <PreLoader />}

      {/* Render the main component after loader */}
      {!loader && <Component {...pageProps} />}

      {/* Add ToastContainer for toast notifications */}
      <ToastContainer 
        position="top-right" // Position of the toast (optional)
        autoClose={3000} // Auto close duration in ms (optional)
        hideProgressBar={false} // Show or hide the progress bar (optional)
        newestOnTop={false} // Whether to show new toasts on top (optional)
        closeOnClick // Close the toast on click (optional)
        pauseOnHover // Pause toast on hover (optional)
        draggable // Allow drag and drop (optional)
      />
    </Fragment>
  );
}

export default MyApp;
