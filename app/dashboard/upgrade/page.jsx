"use client";

import React, { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { createOrder, verifyPayment } from "@/app/utils/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import AnimatedMessage from "../_component/AnimatedMessage";
import { useClerk } from "@clerk/nextjs";
import { useUserInfo } from "@/app/context/UserContext/UserContext";

const plans = [
  {
    name: "Free",
    price: "₹0",
    courseId: "406a677e-4bd3-41f0-96e7-4af58b36c091",
    description: "Perfect for getting started",
    features: ["5 AI-generated study guides", "Basic practice questions", "Ads included"],
    button: "Get Started",
    buttonStyle: "bg-secondary text-secondary-foreground",
  },
  {
    name: "Pro",
    price: "₹20",
    courseId: "f1c942ba-4f36-438f-9174-acfecd20d6d3",
    description: "Ideal for learners seeking more control",
    features: ["20 AI-generated study guides", "Ad-free experience", "Priority support"],
    button: "Upgrade to Pro",
    buttonStyle: "bg-primary text-primary-foreground hover:bg-primary/90",
  },
  {
    name: "Premium",
    price: "₹30",
    courseId: "20325cc7-600e-4008-a3ec-90c84edc060c",
    description: "For serious learners",
    features: ["Unlimited AI-generated guides", "Ad-free experience", "Custom templates", "Priority 24/7 support"],
    button: "Go Premium",
    buttonStyle: "bg-gradient-to-r from-teal-500 to-blue-600 text-white hover:opacity-90",
  },
];

export default function Page() {
  const { user } = useClerk();
  const { userInfo , setUserInfo } = useUserInfo();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadRazorpay = async (plan) => {
    if (plan.price === "₹0") {
      toast.info("Free Plan does not require payment");
      return;
    }

    setLoading(plan.courseId);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = async () => {
      try {
        const { data } = await createOrder(plan.courseId);

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_Id,
          amount: data.order.amount,
          currency: "INR",
          name: "Upgrade Plan",
          description: plan.description,
          order_id: data.order.id,
          handler: async function (response) {
            const res = await verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              user?.primaryEmailAddress?.emailAddress,
              plan.courseId,
              false,
            );

            if (res.data.success) {
              setPaymentDetails({
                amount: plan.price,
                paymentMethod: response.paymentMethod,
                date: new Date().toLocaleDateString(),
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
              });
              toast.success("Payment Verified Successfully");
              setUserInfo((prev) => ({
                ...prev,
                isElite: plan.name === "Premium" ? true : prev.isElite,
                isPremium: plan.name === "Pro" ? true : prev.isPremium,
              }));
            } else {
              toast.error("Payment Verification Failed");
            }
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    script.onerror = () => {
      toast.error("Failed to load Razorpay SDK");
      setLoading(false);
    };

    document.body.appendChild(script);
  };

  const isSubscriptionActive = userInfo?.subscriptionEndDate
    ? new Date(userInfo.subscriptionEndDate) > new Date()
    : false;

  const getRemainingDays = (endDate) => {
    const currentDate = new Date();
    const end = new Date(endDate);
    const difference = Math.floor((end - currentDate) / (1000 * 60 * 60 * 24));
    return difference;
  };

  const remainingDays = getRemainingDays(userInfo?.subscriptionEndDate);

  const canUpgrade = remainingDays <= 3 && remainingDays > 0;

  return (
    <section id="upgrade-plans">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <h2 className="text-3xl font-bold text-center mb-16">
        Upgrade Your Learning Experience 🚀
      </h2>

      {isSubscriptionActive && userInfo?.isElite && (
        <div className="text-center mb-8">
          <p className="text-lg font-semibold">
            {remainingDays > 0
              ? `Your current plan will expire in ${remainingDays} days`
              : "Your subscription has expired!"}
          </p>
          {canUpgrade && (
            <p className="text-primary">
              You can upgrade your plan now before expiration!
            </p>
          )}
        </div>
      )}

<div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-6xl mx-auto">
  {plans.map((plan, index) => {
    const isActive =
      userInfo?.isElite
        ? plan.name === "Premium"
        : userInfo?.isPremium
          ? plan.name === "Pro"
          : plan.price === "₹0"; 

    const isDisabled =
      (userInfo?.isElite && isSubscriptionActive && plan.name === "Free") ||
      (userInfo?.isElite && isSubscriptionActive && plan.name === "Premium");

    return (
      <div
        key={index}
        className={`card ${plan.type} p-8 rounded-lg shadow-lg transition-all duration-300 ${isActive
          ? "border-4 border-primary bg-primary/10 scale-105"
          : "border border-gray-300 hover:shadow-xl"
          } ${isDisabled ? "cursor-not-allowed" : ""}`}
      >
        <h3 className="text-3xl font-bold mb-4">{plan.name}</h3>

        <div>
          <span className="text-4xl font-bold">{plan.price}</span>
          <span className="text-sm ml-1">{plan.price !== "₹0" ? "/month" : ""}</span>
        </div>

        <ul className="mt-6 space-y-3 mb-3 text-sm">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-center">
              <Check className="w-4 h-4 text-green-600 mr-2" />
              {feature}
            </li>
          ))}
        </ul>

        <button
          onClick={() => loadRazorpay(plan)}
          className={`mt-8 ${plan.buttonStyle} flex justify-center items-center h-10 rounded-md px-8 transition-all duration-300 ${isActive || isDisabled || (!canUpgrade && isSubscriptionActive)
            ? "opacity-50 cursor-not-allowed"
            : "hover:scale-105"
            }`}
          disabled={
            isActive ||
            isDisabled ||
            (!canUpgrade && isSubscriptionActive) ||
            loading === plan.courseId
          }
        >
          {loading === plan.courseId ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : isActive ? (
            "Current Plan"
          ) : isDisabled ? (
            "Plan Locked 🔒"
          ) : (
            plan.button
          )}
        </button>
      </div>
    );
  })}
</div>


      {paymentDetails && <AnimatedMessage reqDetails={paymentDetails} />}
    </section>
  );
}