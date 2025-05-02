import { createRazorPayInstance } from "@/configs/razorPay";
import { NextResponse } from "next/server";
import dbConnect from "@/configs/db";

export async function POST(req) {
    try {
        await dbConnect(); // Connecting MongoDB

        const { advLabel, displayUntil, total } = await req.json();

        let labelCost = 0;

        if (advLabel.includes("ALL")) {
            labelCost = 70; // Flat cost for "All"
        } else {
            labelCost = advLabel.length * 20;
        }

        let dayCost = 0;
        if (displayUntil) {
            const today = new Date();
            const displayDate = new Date(displayUntil);
            const diffTime = displayDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            dayCost = diffDays > 0 ? diffDays * 5 : 0;
        }

        const calculatedPrice = labelCost + dayCost;

        if (calculatedPrice !== total) {
            return NextResponse.json({
                success: false,
                message: "Price Tampering Detected 🔥",
            });
        }

        const payload = {
            amount: calculatedPrice * 100, // RazorPay expects amount in paise
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`,
        };

        const razorPayInstance = createRazorPayInstance();
        const order = await razorPayInstance.orders.create(payload);

        return NextResponse.json({
            success: true,
            message: "Advertisement created successfully 🎯",
            order,
        });
    } catch (error) {
        console.log("Error:", error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong ❌",
            error: error.message,
        });
    }
}
