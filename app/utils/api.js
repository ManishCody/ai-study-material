import axios from "axios";

export const createOrder = async (courseId) => {
  return await axios.post("/api/create-order", { courseId });
};

export const verifyPayment = async (order_id, payment_id, signature,email,purchase_id) => {
  return await axios.get(`/api/verify-payment?order_id=${order_id}&payment_id=${payment_id}&signature=${signature}&email=${email}&purchase_id=${purchase_id}`);
};
