"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { createOrder, verifyPayment } from "@/app/utils/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import AnimatedMessage from "../_component/AnimatedMessage";
import { useClerk } from "@clerk/nextjs";

const plans = [
  {
    name: "Free",
    price: "₹0",
    courseId: "406a677e-4bd3-41f0-96e7-4af58b36c091",
    description: "Perfect for getting started",
    features: ["5 AI-generated study guides per month", "Basic practice questions", "Ads included"],
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
  const [paymentDetails, setPaymentDetails] = useState();

  const loadRazorpay = async (plan) => {
    if (plan.price === "₹0") {
      toast.info("Free Plan does not require payment");
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = async () => {
      try {
        const { data } = await createOrder(plan.courseId);
        console.log(data);
        
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
              plan.courseId
            );
            console.log(res);
            
            if (res.data.success) {
              setPaymentDetails({
                amount: plan.price,
                paymentMethod: response.paymentMethod,
                date: new Date().toLocaleDateString(),
                orderId: response.razorpay_order_id, // Store order ID
                paymentId: response.razorpay_payment_id, // Store Payment ID
              });
              toast.success("Payment Verified Successfully");
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
      }
    };

    script.onerror = () => {
      toast.error("Failed to load Razorpay SDK");
    };

    document.body.appendChild(script);
  };

  return (
    <section id="upgrade-plans">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <h2 className="text-3xl font-bold text-center mb-16 relative">
        Upgrade Your Learning Experience
      </h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div key={plan.name} className="flex flex-col p-8 border rounded-lg shadow-sm border-muted">
            <h3 className="text-2xl font-bold">{plan.name}</h3>
            <div className="mt-4 flex items-baseline">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="ml-1 text-muted-foreground">{plan.price === "₹0" ? "" : "/month"}</span>
            </div>
            <ul className="mt-8 space-y-4">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span className="ml-3">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => loadRazorpay(plan)}
              className={`mt-8 ${plan.buttonStyle} h-10 rounded-md px-8`}
            >
              {plan.button}
            </button>
          </div>
        ))}
      </div>

     {paymentDetails && <AnimatedMessage reqDetails={paymentDetails} />}
    </section>
  );
}
