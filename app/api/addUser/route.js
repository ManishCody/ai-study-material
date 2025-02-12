import { NextResponse } from "next/server";
import dbConnect from "@/configs/db";
import User from "@/models/User";

export async function POST(req) {
  try {

    await dbConnect();
    console.log("Database connected successfully");

    const body = await req.json();

    const { email, name } = body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 200 }
      );  
    }

    const newUser = new User({
      name,
      email,
      isPremium:false, 
      isElite:false ,
      creditScore: 0,
    });

    await newUser.save();

    return NextResponse.json(
      { success: true, message: "User added successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding user:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
