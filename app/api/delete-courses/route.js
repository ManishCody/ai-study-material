import dbConnect from "@/configs/db";
import StudyMaterial from "@/models/StudyMaterial";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse the incoming request body
    const { ids } = await req.json(); 

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No valid IDs provided."
        },
        { status: 400 }
      );
    }

    // Delete the documents matching the provided IDs
    const result = await StudyMaterial.deleteMany({
      _id: { $in: ids }
    });

    // Check if documents were deleted
    if (result.deletedCount > 0) {
      return NextResponse.json({
        success: true,
        message: `${result.deletedCount} chapters deleted successfully.`
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "No chapters found for the provided IDs."
        },
        { status: 404 }
      );
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);

    // Return a response indicating an error occurred
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while deleting chapters."
      },
      { status: 500 }
    );
  }
}
