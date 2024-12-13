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

// Retry logic with exponential backoff
const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 2000;

async function sendRequestWithRetry(prompt) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const aiResp = await chatSession.sendMessage(prompt);
      const rawResponse = await aiResp.response.text();
      return parseAIResponse(rawResponse);
    } catch (error) {
      const isRateLimited = error?.response?.status === 429;
      if (isRateLimited && attempt < MAX_RETRIES) {
        const backoffTime = RETRY_DELAY_MS * Math.pow(2, attempt);
        console.warn(`Rate limited. Retrying in ${backoffTime}ms...`);
        await new Promise((resolve) => setTimeout(resolve, backoffTime));
      } else {
        console.error("AI request failed:", error);
        throw new Error("Failed to generate chapter notes.");
      }
    }
  }
  throw new Error("Failed after maximum retries.");
}

// Transform AI response into the required structure
function transformAIResponse(aiResult) {
  if (!aiResult?.chapters) {
    console.warn("Invalid AI response: Missing 'chapters'");
    return [];
  }

  return aiResult.chapters.map((chapter, index) => ({
    chapterTitle: chapter.title || `Chapter ${index + 1}`,
    topics: chapter.topics.map((topic) => ({
      title: topic || "Untitled Topic",
      htmlContent: {
        summary: topic?.summary || "No summary provided.",
        keyPoints: topic?.key_points || ["No key points available."],
      },
    })),
  }));
}

// Generate chapter notes for a study material
async function generateChapterNotes(material) {
  const updatedChapters = [];

  for (const chapter of material?.courseLayout?.chapters || []) {
    const updatedTopics = [];

    for (const topic of chapter.topics || []) {
      const chapterPrompt = `Generate detailed HTML content for the topic "${topic.title}" in the context of the chapter titled "${chapter.chapterTitle}" in the course titled "${material.topic}". The content should include:
      - "courseTitle": Course title,
      - "chapterTitle": Chapter title,
      - "topicTitle": The title of the topic.
      - "summary": A detailed HTML summary of the topic.
      - "keyPoints": Key points as an array of strings in HTML format.
      Maintain the exact structure of the JSON object with the key names "htmlContent", "topicTitle", "summary", and "keyPoints". Return only the JSON object.`;

      try {
        const chapterContent = await sendRequestWithRetry(chapterPrompt);
        if (!chapterContent?.htmlContent) {
          console.warn("Invalid content from AI response.");
        }

        updatedTopics.push({
          title: chapterContent.htmlContent.topicTitle || topic.title,
          htmlContent: {
            summary: chapterContent.htmlContent.summary || "Summary not available.",
            keyPoints: chapterContent.htmlContent.keyPoints || [],
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

  await StudyMaterial.findByIdAndUpdate(material._id, {
    courseLayout: { chapters: updatedChapters },
    notes: true,
  });
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
