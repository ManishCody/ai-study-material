import { chatSession } from "@/configs/AIModel";
import { NextResponse } from "next/server";
import dbConnect from "@/configs/db";
import StudyMaterial from "@/models/StudyMaterial";

// Utility to parse AI response
function parseAIResponse(responseText) {
  try {
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return [];
  }
}

// Retry logic for AI request
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

async function sendRequestWithRetry(prompt) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const aiResp = await chatSession.sendMessage(prompt);
      const rawResponse = await aiResp.response.text();
      return parseAIResponse(rawResponse);
    } catch (error) {
      if (attempt < MAX_RETRIES) {
        console.warn(
          `AI service unavailable (attempt ${attempt}/${MAX_RETRIES}). Retrying in ${RETRY_DELAY_MS}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      } else {
        console.error("AI request failed:", error);
        throw new Error("Failed to generate flashcards.");
      }
    }
  }
}

// POST handler
export async function POST(req) {
  try {

    const { topic, studyMaterialId } = await req.json();

    if (!topic || !studyMaterialId) {
      return NextResponse.json(
        { error: "Missing required parameters: topic or studyMaterialId" },
        { status: 400 }
      );
    }
    dbConnect();

    const prompt = `Generate up to 10-15 flashcards on the topic "${topic}" in JSON format. Each flashcard should have "front" and "back" keys. The front side should contain the question or term, and the back side should provide the answer or explanation.`;
    const flashcards = await sendRequestWithRetry(prompt);
    console.log(flashcards);

    if (!flashcards?.flashcards?.length) {
      return NextResponse.json(
        { error: "Failed to generate flashcards." },
        { status: 500 }
      );
    }

    const updatedStudyMaterial = await StudyMaterial.findById({_id:studyMaterialId});
    console.log(updatedStudyMaterial);

    if (!updatedStudyMaterial) {
      return NextResponse.json(
        { error: "StudyMaterial not found." },
        { status: 404 }
      );
    }

    updatedStudyMaterial.flashcards.exists = true;
    updatedStudyMaterial.flashcards.data = flashcards;
    await updatedStudyMaterial.save();


    return NextResponse.json({ message: "Flashcards stored successfully", updatedStudyMaterial });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
