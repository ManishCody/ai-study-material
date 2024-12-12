import dbConnect from "@/configs/db";
import StudyMaterial from "@/models/StudyMaterial";
import { chatSession } from "@/configs/AIModel";
import { NextResponse } from "next/server";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

// Function to transform AI response into the required structure
function transformAIResponse(aiResult) {
  try {
    if (!aiResult || !aiResult?.chapters) {
      throw new Error("Invalid AI response structure.");
    }

    return aiResult.chapters.map((chapter, index) => ({
      chapterTitle: chapter?.title || `Chapter ${index + 1}`,
      topics: chapter?.topics?.map((topic) => ({
        title: topic || "Untitled Topic",
        htmlContent: {
          summary: topic?.summary || "No summary provided.",
          keyPoints: topic?.key_points || ["No key points available."],
        },
      })) || [],
    }));
  } catch (error) {
    console.error("Error transforming AI response:", error);
    throw new Error("Failed to transform AI response.");
  }
}

// Retry logic
async function sendRequestWithRetry(prompt) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const aiResp = await chatSession.sendMessage(prompt);
      const rawResponse = await aiResp.response.text();
      console.log(rawResponse);
      
      const parsedResponse = JSON.parse(rawResponse);

      if (!parsedResponse) {
        throw new Error("AI response is empty or invalid.");
      }

      return parsedResponse;
    } catch (error) {
      const isRetryable = error.response?.status === 503;
      if (attempt < MAX_RETRIES && isRetryable) {
        console.warn(
          `AI service unavailable (attempt ${attempt}/${MAX_RETRIES}). Retrying in ${RETRY_DELAY_MS * attempt}ms...`
        );
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAY_MS * attempt)
        );
      } else {
        console.error("Error during AI request:", error);
        throw new Error("AI request failed: " + error.message);
      }
    }
  }
  throw new Error("Max retries reached for AI request.");
}

// Generate chapter notes for study material
async function generateChapterNotes(material) {
  try {
    const updatedChapters = [];

    for (const chapter of material.courseLayout.chapters) {
      const updatedTopics = [];

      for (const topic of chapter.topics) {
        const chapterPrompt = `Generate detailed HTML content for the topic "${topic.title}" in the context of the chapter titled "${chapter.chapterTitle}" in the course titled "${material.topic}". The content should include:
        - "courseTitle": course title,
        - "chapterTitle": 'Chapter title',
        - "topicTitle": The title of the topic,
        - "summary": A detailed HTML summary of the topic,
        - "keyPoints": Key points as an array of strings in HTML format.
        Maintain the exact structure of the JSON object with the key names as "htmlContent", "topicTitle", "summary", and "keyPoints". Return only the JSON object.`;

        try {
          const chapterContent = await sendRequestWithRetry(chapterPrompt);
          updatedTopics.push({
            title: chapterContent?.htmlContent?.topicTitle || topic.title,
            htmlContent: {
              summary: chapterContent?.htmlContent?.summary || "Summary not available.",
              keyPoints: chapterContent?.htmlContent?.keyPoints || [],
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

    console.log("Chapter notes updated successfully for StudyMaterial:", material._id);
  } catch (error) {
    console.error("Error updating chapter notes:", error);
    throw new Error("Failed to generate chapter notes.");
  }
}

// POST handler
export async function POST(req) {
  try {
    await dbConnect();
    const { courseId, topic, courseType, difficultyLevel, createdBy } = await req.json();

    if (!courseId || !topic || !courseType || !difficultyLevel || !createdBy) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const prompt = `Generate study material for ${topic} for an ${courseType}. The difficulty level should be ${difficultyLevel}. The study material should include:
    - A course summary,
    - A list of chapters, each with a chapter summary and topics,
    - Suggest one image URL representing the topic '${topic}',
    Output in JSON format.`;

    const aiResult = await sendRequestWithRetry(prompt);

    const transformedChapters = transformAIResponse(aiResult);

    const studyMaterial = new StudyMaterial({
      courseId,
      courseType,
      createdBy,
      topic,
      difficultyLevel,
      courseLayout: { chapters: transformedChapters },
      course_summary: aiResult?.course_summary,
      topicImage: aiResult?.image_url || "",
      status: "Pending",
    });

    const savedMaterial = await studyMaterial.save();

    if (savedMaterial.status === "Pending") {
      await generateChapterNotes(savedMaterial);
    }

    return NextResponse.json({ result: savedMaterial });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
