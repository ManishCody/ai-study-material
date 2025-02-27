import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";


const AdvertisementForm = () => {
  const [formData, setFormData] = useState({
    image: "",
    text: "",
    desc: "",
    displayUntil: "",
    targetCourse: "",
    advLabel: [],
    addedBy:localStorage.getItem("CLERK_USER_ID")
  });
  const [formError, setFormError] = useState({
    displayUntil: "",
  });

  const [customLabels, setCustomLabels] = useState([
    "Engineering",
    "Science",
    "Mathematics",
    "Technology",
  ]);

  const [bill, setBill] = useState({
    labelCost: 0,
    dayCost: 0,
    total: 0,
  });

  useEffect(() => {
    calculateBill();
  }, [formData.advLabel, formData.displayUntil]);

  const calculateBill = () => {
    let labelCost = 0;

    if (formData.advLabel.includes("All")) {
      labelCost = 70; // Flat cost for "All"
    } else {
      labelCost = formData.advLabel.length * 20; // Normal cost for other advLabel
    }

    let dayCost = 0;
    if (formData.displayUntil) {
      const today = new Date();
      const displayDate = new Date(formData.displayUntil);
      const diffTime = displayDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      dayCost = diffDays > 0 ? diffDays * 5 : 0;
    }

    setBill({
      labelCost,
      dayCost,
      total: labelCost + dayCost,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "displayUntil") {
      const today = new Date().toISOString().split("T")[0];
      if (value < today) {
        setFormError((prev) => ({
          ...prev,
          displayUntil: "Display Until date cannot be in the past.",
        }));
        return;
      } else {
        setFormError((prev) => ({
          ...prev,
          displayUntil: "",
        }));
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLabelChange = (label) => {
    if (label === "All") {
      setFormData((prev) => ({
        ...prev,
        advLabel: prev.advLabel.includes("All") ? [] : ["All"],
      }));
    } else {
      setFormData((prev) => {
        if (prev.advLabel.includes("All")) {
          return { ...prev, advLabel: [label] };
        }

        const isAlreadySelected = prev.advLabel.includes(label);
        let updatedLabels;

        if (isAlreadySelected) {
          updatedLabels = prev.advLabel.filter((l) => l !== label);
        } else {
          if (prev.advLabel.length >= 2) {
            updatedLabels = [...prev.advLabel.slice(1), label];
          } else {
            updatedLabels = [...prev.advLabel, label];
          }
        }

        return { ...prev, advLabel: updatedLabels };
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...formData,
        advLabel: formData.advLabel.map(label => label.toUpperCase()) 
      };
      await axios.post("/api/create-adv", formattedData);
      toast.success("Advertisement created successfully!");
    } catch (error) {
      console.log("Error:", error);
      toast.error("Failed to create advertisement. Please try again.");
    }finally{
      setFormData({
        image: "",
        text: "",
        desc: "",
        displayUntil: "",
        targetCourse: "",
        advLabel: [],
        addedBy:localStorage.getItem("CLERK_USER_ID")
      })
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-auto flex items-center justify-center p-4"
    >
      <motion.form
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="w-full max-w-4xl h-full p-6 shadow-2xl rounded-lg overflow-y-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block font-medium">Image URL:</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-medium">Text:</label>
            <input
              name="text"
              value={formData.text}
              onChange={handleChange}
              required
              maxLength={500}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-medium">Description:</label>
            <textarea
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-medium">Display Until:</label>
            <input
              type="date"
              required
              name="displayUntil"
              value={formData.displayUntil}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {formError.displayUntil && (
              <p className="text-red-500 text-sm">{formError.displayUntil}</p>
            )}
          </div>
        </div>

        <div className="space-y-4 mt-4">
          <label className="block font-medium">Labels:</label>
          <div className="flex flex-wrap gap-2">
            {["All", ...customLabels].map((label) => {
              const isSelected = formData.advLabel.includes(label);
              const isDisabled =
                formData.advLabel.includes("All") && label !== "All";
              const isLimitReached =
                formData.advLabel.length >= 2 && !isSelected;

              return (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  key={label}
                  type="button"
                  onClick={() => handleLabelChange(label)}
                  disabled={isDisabled || (isLimitReached && label !== "All")}
                  className={`px-4 py-2 border rounded-full transition-all ${
                    isSelected
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  } ${
                    isDisabled || (isLimitReached && label !== "All")
                      ? "opacity-50 cursor-not-allowed"
                      : `${
                          isSelected
                            ? "hover:bg-blue-100 hover:text-black"
                            : "hover:bg-blue-100"
                        }`
                  }`}
                >
                  {label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Billing Section */}
        <div className="mt-8 bg-gray-100 p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3">Billing Summary</h3>
          <div className="flex justify-between mb-1">
            <span>Labels Cost (₹20 per label):</span>
            <span className="font-semibold">₹{bill.labelCost}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Display Duration Cost (₹5 per day):</span>
            <span className="font-semibold">₹{bill.dayCost}</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between text-lg font-bold text-green-600">
            <span>Total Cost:</span>
            <span>₹{bill.total}</span>
          </div>
        </div>

        <motion.button
          type="submit"
          className="w-full bg-green-500 text-white py-3 mt-6 rounded hover:bg-green-600"
        >
          Create Advertisement
        </motion.button>
      </motion.form>
      <ToastContainer position="top-right" autoClose={3000} />
    </motion.div>
  );
};

export default AdvertisementForm;
