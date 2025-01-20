// components/AdContainer.js
"use client"
import { useState, useEffect } from "react";

const AdContainer = () => {
  const [showAd, setShowAd] = useState(false);
  const [adContent, setAdContent] = useState(null);
  const [canClose, setCanClose] = useState(false);
  const [countdown, setCountdown] = useState(20);

  useEffect(() => {
    // Show the ad container immediately on page load
    setShowAd(true);
  
    // Fetch dynamic ad content
    fetchAdContent();
  
    // Disable closing for 20 seconds after showing the ad

    const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 1) {
            return prev - 1;
          } else {
            clearInterval(countdownInterval);
            setCanClose(true); // Enable closing when countdown finishes
            return 0;
          }
        });
      }, 1000);
  
    // Set a timeout to show the ad again after 20 minutes
    const showAdTimeout = setTimeout(() => {
      setShowAd(true);
      setCanClose(false); // Disable closing again for 20 seconds
      fetchAdContent();
  
      const closeTimeout = setTimeout(() => setCanClose(true), 20000);
  
      return () => clearTimeout(closeTimeout);
    }, 20 * 60 * 1000); // 20 minutes
  
    return () => {
      clearTimeout(countdownInterval);
      clearTimeout(showAdTimeout);
    };
  }, []);
  

  const fetchAdContent = () => {
    // Simulate fetching ad content
    const dynamicAd = {
      image: "https://etimg.etb2bimg.com/thumb/msid-112837046,imgsize-83008,width-1200,height=765,overlay-etbrandequity/advertising/kiccha-sudeep-adds-crunch-in-mcdonalds-indias-new-ad.jpg", // Replace with actual URL
      text: "This is a dynamic ad! Check out our new products.",
    };
    setAdContent(dynamicAd);
  };

  const closeAd = () => {
    if (canClose) setShowAd(false);
  };

  if (!showAd) return null;

  return (
    <div className="fixed bottom-0 right-5 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50">
      <img
        src={adContent?.image}
        alt="Ad"
        className="w-full h-auto rounded-lg"
      />
      <p className="mt-2 text-sm text-gray-700">{adContent?.text}</p>
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
