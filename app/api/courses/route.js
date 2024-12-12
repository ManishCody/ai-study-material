import dbConnect from "@/configs/db"; // Mongoose database connection utility
import StudyMaterial from "@/models/StudyMaterial"; // Mongoose model for study material
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect(); // Ensure database connection is established

    const { createdBy } = await req.json();

    if (!createdBy) {
      return NextResponse.json(
        { error: "Missing required parameter: createdBy" },
        { status: 400 }
      );
    }

    // Fetch study materials based on the createdBy (email)
    const result = await StudyMaterial.find({ createdBy });

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error fetching study materials:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}


export async function GET(req) {

  try {

    await dbConnect();

    const reqUrl = req.url;
    const { searchParams } = new URL(reqUrl);

    const courseId = searchParams?.get('courseid');

    const course = await StudyMaterial.findById({ _id: courseId });

    return NextResponse.json({ course });
  } catch (error) {
    console.error("Error fetching study materials:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }

}
