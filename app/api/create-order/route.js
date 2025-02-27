import { NextResponse } from "next/server";
import { createRazorPayInstance } from "@/configs/razorPay";

export async function POST(req) {
    try {
        const { courseId } = await req.json();

        let amt = 0;

        if (courseId == 'f1c942ba-4f36-438f-9174-acfecd20d6d3') {
            amt = 20;
        } else if (courseId == '20325cc7-600e-4008-a3ec-90c84edc060c') {
            amt = 30;
        }

        const payload = {
            amount: amt * 100, // Corrected "amounta" to "amount"
            currency: "INR",
            receipt: 'receipt_order_1'
        };

        const razorPayInstance = createRazorPayInstance();
        const order = await razorPayInstance.orders.create(payload);

        return NextResponse.json({
            success: true,
            order
        });
        
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
}

// 406a677e-4bd3-41f0-96e7-4af58b36c091
// f1c942ba-4f36-438f-9174-acfecd20d6d3
// 20325cc7-600e-4008-a3ec-90c84edc060c