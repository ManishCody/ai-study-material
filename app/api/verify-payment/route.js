import crypto from "crypto";
import { NextResponse } from "next/server";
import dbConnect from "@/configs/db";
import User from "@/models/User";
import Payment from "@/models/Payment";
import Ads from "@/models/Ads";

export const runtime = "nodejs";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const razorpay_order_id = searchParams.get("order_id");
    const razorpay_payment_id = searchParams.get("payment_id");
    const razorpay_signature = searchParams.get("signature");
    const email = decodeURIComponent(searchParams.get("email"));
    const purchase_id = searchParams.get("purchase_id");
    const isAdvertisement = searchParams.get("isAdvertisement") === "true";
    const advLabel = searchParams.get("advLabel")
      ? decodeURIComponent(searchParams.get("advLabel")).split(",")
      : [];
    const displayUntil = searchParams.get("displayUntil");
    const image = decodeURIComponent(searchParams.get("image"));
    const text = decodeURIComponent(searchParams.get("text"));
    const amount = searchParams.get("amount");
    const secret = process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({
        success: false,
        message: "Missing Required Parameters",
      });
    }

    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({
        success: false,
        message: "Payment Verification Failed ",
      });
    }

    await dbConnect();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "No user found. Please contact support team.",
      });
    }

    let payment = null;

    if (isAdvertisement) {
      const advertisement = await Ads.create({
        image,
        text,
        addedBy: email,
        displayUntil,
        advLabel,
      });

      payment = new Payment({
        userId: user._id,
        amount,
        paymentMethod: "RAZORPAY",
        status: "Completed",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });

      user.paymentHistory.push(payment._id);

      await Promise.all([
        advertisement.save(),
        payment.save(),
        user.save({ validateBeforeSave: false }),
      ]);

      return NextResponse.json({
        success: true,
        message: "Advertisement Payment Verified & Created Successfully ",
      });
    } else {
      let amt = 0;

      if (purchase_id === "20325cc7-600e-4008-a3ec-90c84edc060c") {
        user.isElite = true;
        amt = 30;
      } else if (purchase_id === "f1c942ba-4f36-438f-9174-acfecd20d6d3") {
        user.isPremium = true;
        amt = 20;
      } else {
        return NextResponse.json({
          success: false,
          message: "Invalid Purchase ID",
        });
      }

      payment = new Payment({
        userId: user._id,
        amount: amt,
        paymentMethod: "RAZORPAY",
        status: "Completed",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });

      user.paymentHistory.push(payment._id);
      user.subscriptionStartDate = new Date();
      user.subscriptionEndDate = new Date(new Date().setMonth(new Date().getMonth() + 1));

      await Promise.all([
        payment.save(),
        user.save({ validateBeforeSave: false }),
      ]);

      return NextResponse.json({
        success: true,
        message: "User Payment Verified & Subscription Activated ",
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}
