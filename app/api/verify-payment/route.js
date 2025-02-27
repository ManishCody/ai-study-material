import crypto from "crypto";
import { NextResponse } from "next/server";
import dbConnect from "@/configs/db";
import User from "@/models/User";

export const runtime = "nodejs";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const razorpay_order_id = searchParams.get("order_id");
        const razorpay_payment_id = searchParams.get("payment_id");
        const razorpay_signature = searchParams.get("signature");
        const email = searchParams.get("email");
        const purchase_id = searchParams.get("purchase_id");

        const secret = process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET;

        const generated_signature = crypto
            .createHmac("sha256", secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        console.log("Generated Signature:", generated_signature);
        console.log("Razorpay Signature:", razorpay_signature);

        if (generated_signature === razorpay_signature) {
            await dbConnect(); // Connect DB

            const user = await User.findOne({ email });
            console.log(user);
            
            if (!user) {
                return NextResponse.json({
                    success: false,
                    message: "No user found. Please contact the support team for payment verification."
                });
            }

            if (purchase_id == "20325cc7-600e-4008-a3ec-90c84edc060c") {
                console.log("hi");
                
                user.isElite = true;
            } else if (purchase_id === "f1c942ba-4f36-438f-9174-acfecd20d6d3") {
                console.log("hi");
                user.isPremium = true;
            } else {
                return NextResponse.json({
                    success: false,
                    message: "Invalid Purchase ID. Please contact the support team."
                });
            }
            console.log("hi");
            await user.save({validateBeforeSave: false });

            return NextResponse.json({
                success: true,
                message: "Payment Verified & User Updated Successfully"
            });
        } else {
            return NextResponse.json({
                success: false,
                message: "Payment Verification Failed"
            });
        }
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
}
