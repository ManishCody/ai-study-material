"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const AdContainer = () => {
  const [showAd, setShowAd] = useState(false);
  const [adContent, setAdContent] = useState(null);
  const [canClose, setCanClose] = useState(false);
  const [countdown, setCountdown] = useState(20);

  useEffect(() => {
    let countdownInterval;
    let showAdTimeout;

    const fetchAndStoreAds = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        const response = await axios.get("/api/fetch-adv", { params: { email } });

        if (response.data.ads.length > 0) {
          localStorage.setItem("adsList", JSON.stringify(response.data.ads));
        } else {
          localStorage.setItem("adsList", JSON.stringify([
            { image: "https://via.placeholder.com/300", text: "No ads available!" }
          ]));
        }
      } catch (error) {
        console.log("Error fetching ads:", error);
      }
    };

    const getNextAd = () => {
      let adsList = JSON.parse(localStorage.getItem("adsList")) || [];
      if (adsList.length === 0) {
        fetchAndStoreAds(); // Fetch new ads if none are left
        return null;
      }
      const currentAd = adsList.shift();
      localStorage.setItem("adsList", JSON.stringify(adsList));
      return currentAd;
    };

    const startAd = () => {
      const nextAd = getNextAd();
      if (!nextAd) return; // No ads to show

      setAdContent(nextAd);
      setShowAd(true);
      setCanClose(false); // Disable closing for 20 seconds
      localStorage.setItem("lastAdTime", Date.now());

      countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 1) return prev - 1;
          clearInterval(countdownInterval);
          setCanClose(true); // Enable closing when countdown finishes
          return 0;
        });
      }, 1000);
    };

    const lastAdTime = localStorage.getItem("lastAdTime");
    const now = Date.now();

    if (!lastAdTime || now - parseInt(lastAdTime) >= 20 * 60 * 1000) {
      startAd(); // Show ad immediately
    } else {
      const remainingTime = 20 * 60 * 1000 - (now - parseInt(lastAdTime));
      showAdTimeout = setTimeout(startAd, remainingTime); // Wait for the remaining time
    }

    return () => {
      clearInterval(countdownInterval);
      clearTimeout(showAdTimeout);
    };
  }, []);

  const closeAd = () => {
    if (canClose) setShowAd(false);
  };

  if (!showAd || !adContent) return null;

  return (
    <div className="fixed bottom-0 right-5 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50">
      <img src={adContent.image} alt="Ad" className="w-[400px] h-auto rounded-lg" />
      <p className="mt-2 text-sm text-gray-700">{adContent.text}</p>
      <button
        onClick={closeAd}
        className={`mt-3 px-4 py-2 text-sm font-medium text-white rounded ${
          canClose ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
        }`}
        disabled={!canClose}
      >
        {canClose ? "Close" : `Wait ${countdown} seconds`}
      </button>
    </div>
  );
};

export default AdContainer;
