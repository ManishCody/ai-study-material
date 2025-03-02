import axios from "axios";

export const createOrder = async (courseId) => {
  return await axios.post("/api/create-order", { courseId });
};

export const createadv = async (advLabel, displayUntil, total) => {
  return await axios.post("/api/createadv", { advLabel, displayUntil, total });
};

export const verifyPayment = async (
  order_id,
  payment_id,
  signature,
  email,
  purchase_id,
  isAdvertisement,
  advLabel,
  displayUntil,
  image,
  text,
  amount,
) => {
  // Create a query params object and remove undefined or empty values
  const params = {
    order_id,
    payment_id,
    signature,
    email,
    purchase_id,
    isAdvertisement,
    advLabel,
    displayUntil,
    image,
    text,
    amount,
  };

  // Filter out undefined, null, or empty values
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined && value !== "" && value !== null)
  );

  const queryString = new URLSearchParams(filteredParams).toString();

  console.log(`/api/verify-payment?${queryString}`);

  return await axios.get(`/api/verify-payment?${queryString}`);
};

