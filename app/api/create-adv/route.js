// app/api/advertisements/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/configs/db";
import Advertisement from "@/models/Ads";

export async function POST(req) {
  console.log("API Route Hit");

  try {
    // Connect to the database
    await dbConnect();

    // Parse the incoming JSON data
    const data = await req.json();

    // Create a new advertisement document
    const newAd = await Advertisement.create(data);
    console.log(newAd);
    
    // Return a successful JSON response
    return NextResponse.json({ success: true, data: newAd });
  } catch (error) {
    console.log("Error creating advertisement:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
