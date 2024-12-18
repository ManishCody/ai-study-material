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
    return null;
  }
}

// Add delay between API calls to prevent hitting rate limits
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Generate content for a single topic with retry logic
async function generateTopicContent(chapterPrompt, retries = 3, delayMs = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const aiResp = await chatSession.sendMessage(chapterPrompt);
      const rawResponse = await aiResp.response.text();
      console.log("AI Response:", rawResponse);
      const parsedResponse = parseAIResponse(rawResponse);

      if (parsedResponse) return parsedResponse;
      throw new Error("Empty or invalid AI response.");
    } catch (error) {
      console.error(`Error during AI request (attempt ${i + 1}):`, error);
      if (i < retries - 1) await delay(delayMs * (i + 1)); // Exponential backoff
    }
  }
  throw new Error("Failed to generate content after multiple attempts.");
}

// Generate chapter notes for a study material
async function generateChapterNotes(material) {
  const updatedChapters = [];

  for (const chapter of material?.courseLayout?.chapters || []) {
    const updatedTopics = [];

    for (const topic of chapter.topics || []) {
      const chapterPrompt = `
        Generate detailed HTML content for the topic "${topic.title}" in the context of the chapter titled "${chapter.chapterTitle}" in the course titled "${material.topic}". 
        The content should include:
        - "courseTitle": Course title,
        - "chapterTitle": Chapter title,
        - "topicTitle": The title of the topic,
        - "summary": A detailed HTML summary of the topic,
        - "keyPoints": Key points as an array of strings in HTML format.
        Maintain the exact structure of the JSON object with the key names "htmlContent", "topicTitle", "summary", and "keyPoints". 
        Return only the JSON object.`;

      try {
        const response = await generateTopicContent(chapterPrompt);
        updatedTopics.push({
          title: topic.title,
          htmlContent: response.htmlContent || {
            summary: "No summary provided.",
            keyPoints: ["No key points available."],
          },
        });
      } catch (error) {
        console.error(`Failed to generate content for topic "${topic.title}":`, error);
        updatedTopics.push({
          title: topic.title,
          htmlContent: {
            summary: "Summary not available due to an error.",
            keyPoints: [],
          },
        });
      }
    }

    updatedChapters.push({
      chapterTitle: chapter.chapterTitle,
      topics: updatedTopics,
    });
  }

  console.log("Transformed Chapters:", updatedChapters);

  // Update StudyMaterial in DB
  await StudyMaterial.findByIdAndUpdate(
    material._id,
    {
      $set: {
        "courseLayout.chapters": updatedChapters,
        notes: true,
      },
    },
    { new: true }
  );
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

    await dbConnect();
    console.log("Received parameters:", topic, studyMaterialId);

    const studyMaterial = await StudyMaterial.findById(studyMaterialId);

    if (!studyMaterial) {
      return NextResponse.json(
        { error: "StudyMaterial not found." },
        { status: 404 }
      );
    }

    console.log("Generating notes for study material...");
    await generateChapterNotes(studyMaterial);

    console.log("Notes generated successfully.");
    return NextResponse.json({
      message: "Notes stored successfully.",
      studyMaterial,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
