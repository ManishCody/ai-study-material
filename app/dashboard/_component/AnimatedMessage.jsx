import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, FileText, Loader2 } from "lucide-react";
import axios from "axios";
import { downloadPDF } from "@/app/utils/pdf";

const RobotAnimation = ({ show }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        className="absolute top-0 left-1/3 transform -translate-x-1/2 -translate-y-full"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div className="relative">
          <motion.div
            className="bg-blue-500 text-white p-6 rounded-full shadow-lg"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2 }}
          >
            <FileText size={48} />
          </motion.div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const ReceiptModal = ({ show, onClose, paymentDetails, loading }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div className="bg-white p-6 rounded-lg shadow-xl w-96">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-blue-600">
              StudyBeam Payment Receipt
            </h2>
            <button className="text-red-500 font-bold" onClick={onClose}>
              ✖
            </button>
          </div>

          {loading ? (
            <div className="text-center text-gray-500">Loading receipt...</div>
          ) : (
            <>
              <p className="mb-2 text-sm">
                <strong>Payment ID:</strong> {paymentDetails.id}
              </p>
              <p className="mb-2 text-sm">
                <strong>Amount:</strong> ₹{(paymentDetails.amount / 100).toFixed(2)}
              </p>
              <p className="mb-2 text-sm">
                <strong>Payment Method:</strong> {paymentDetails.method}
              </p>
              <p className="mb-2 text-sm">
                <strong>Status:</strong> {paymentDetails.status}
              </p>
              <p className="mb-2 text-sm">
                <strong>Email:</strong> {paymentDetails.email}
              </p>
              <p className="mb-2 text-sm">
                <strong>Contact:</strong> {paymentDetails.contact}
              </p>
            </>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg w-full mt-4"
            onClick={() => downloadPDF(paymentDetails)}
          >
            Download Receipt
          </motion.button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const PaymentCard = ({ amount, date, paymentMethod, onReceiptClick, onClose , loading}) => (
  <AnimatePresence>
    <motion.div
      className="bg-white rounded-xl shadow-2xl overflow-hidden group relative"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Payment Successful</h2>
          <CreditCard size={24} />
        </div>
      </div>

      <button
        className="absolute top-1 right-2 opacity-0 group-hover:opacity-100 text-white rounded-full w-6 h-6 flex items-center justify-center"
        onClick={onClose}
      >
        ✖
      </button>

      <div className="p-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500">Amount</span>
            <span className="font-medium">{amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date</span>
            <span className="font-medium">{date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment Method</span>
            <span className="font-medium">{paymentMethod}</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r flex justify-center items-center from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium shadow-md"
            onClick={onReceiptClick}
          >
            {loading ? <Loader2 className="animate-spin w-6 h-6 flex justify-center items-center " /> : 'View Receipt'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  </AnimatePresence>
);

const AnimatedMessage = ({ reqDetails }) => {
  const { amount, date, paymentMethod, paymentId } = reqDetails;
  const [showRobot, setShowRobot] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sequence = async () => {
      setShowRobot(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowCard(true); 
      setShowRobot(false); 
    };
    console.log("hi");
    
    sequence();
  }, [reqDetails]);
 

  const fetchPaymentDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/payment/${paymentId}`);
      console.log(res.data);
      setPaymentDetails(res.data);
    } catch (error) {
      console.error("Error fetching payment details:", error);
      alert("Failed to fetch receipt");
    } finally {
      setLoading(false);
      setShowReceipt(true);
    }
  };

  return (
    <div className="absolute top-1/3 left-1/3 w-full max-w-md">
      <RobotAnimation show={showRobot} />
      {showCard && (
        <PaymentCard
          amount={amount}
          date={date}
          paymentMethod={paymentMethod}
          onReceiptClick={fetchPaymentDetails}
          onClose={() => setShowCard(false)}
          loading={loading}
        />
      )}
      <ReceiptModal
        show={showReceipt}
        onClose={() => setShowReceipt(false)}
        paymentDetails={paymentDetails}
        loading={loading}
      />
    </div>
  );
};

export default AnimatedMessage;
