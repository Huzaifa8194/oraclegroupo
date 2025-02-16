"use client";

import { useEffect } from "react";

const GoogleTranslate = () => {
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      if (!document.getElementById("google-translate-script")) {
        const script = document.createElement("script");
        script.id = "google-translate-script";
        script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
      }

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", autoDisplay: false },
          "google_translate_element"
        );
      };

      // If script is already loaded, manually trigger init
      if (window.google && window.google.translate) {
        window.googleTranslateElementInit();
      }
    };

    addGoogleTranslateScript();
  }, []);

  return (
    <div
      id="google_translate_element"
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
      }}
    ></div>
  );
};

export default GoogleTranslate;
