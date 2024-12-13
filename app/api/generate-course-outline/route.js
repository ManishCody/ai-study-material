import dbConnect from "@/configs/db";
import StudyMaterial from "@/models/StudyMaterial";
import { chatSession } from "@/configs/AIModel";
import { NextResponse } from "next/server";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 2000;

// Function to transform AI response into the required structure
function transformAIResponse(aiResult) {
  try {
    if (!aiResult || !aiResult?.chapters) {
      console.warn("AI response structure invalid. Falling back to empty chapters.");
      return [];
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
    return [];
  }
}

// Retry logic with exponential backoff
async function sendRequestWithRetry(prompt) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const aiResp = await chatSession.sendMessage(prompt);
      const rawResponse = await aiResp.response.text();
      const parsedResponse = JSON.parse(rawResponse);

      if (!parsedResponse) {
        throw new Error("AI response is empty or invalid.");
      }

      return parsedResponse;
    } catch (error) {
      const isRetryable = error.response?.status === 503;
      if (attempt < MAX_RETRIES && isRetryable) {
        const delay = RETRY_DELAY_MS * attempt;
        console.warn(
          `Retry attempt ${attempt}/${MAX_RETRIES}: Retrying in ${delay}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        console.error("Failed to process AI request:", error?.message || error);
      }
    }
  }
  throw new Error("AI service failed after maximum retries.");
}

// Generate chapter notes for study material
async function generateChapterNotes(material) {
  try {
    const updatedChapters = await Promise.all(
      material.courseLayout.chapters.map(async (chapter) => {
        const updatedTopics = await Promise.all(
          chapter.topics.map(async (topic) => {
            const chapterPrompt = `Generate detailed HTML content for the topic "${topic.title}" in the context of the chapter titled "${chapter.chapterTitle}" in the course titled "${material.topic}". The content must adhere to the following structure and constraints:

- The output must be a **single valid JSON object** with the following fields:
  - 'htmlContent': An object containing:
    - 'courseTitle': A string with the course title.
    - 'chapterTitle': A string with the chapter title.
    - 'topicTitle': A string with the topic title.
    - 'summary': A detailed HTML summary of the topic enclosed within '<div>' or other appropriate HTML tags.
    - 'keyPoints': An array of strings, where each string is a key point enclosed in appropriate HTML tags (e.g., '<li>' for list items).

- Ensure all fields are properly formatted as valid JSON keys.
- Do not include any additional text, explanations, or non-JSON content.
- All content should be properly escaped and formatted for valid HTML.`;

            try {
              const chapterContent = await sendRequestWithRetry(chapterPrompt);
              return {
                title: chapterContent?.htmlContent?.topicTitle || topic.title,
                htmlContent: {
                  summary: chapterContent?.htmlContent?.summary || "Summary not available.",
                  keyPoints: chapterContent?.htmlContent?.keyPoints || [],
                },
              };
            } catch (error) {
              console.error(`Failed to generate content for topic "${topic.title}":`, error);
              return {
                title: topic.title,
                htmlContent: {
                  summary: "Summary not available due to an error.",
                  keyPoints: [],
                },
              };
            }
          })
        );

        return {
          chapterTitle: chapter.chapterTitle,
          topics: updatedTopics,
        };
      })
    );

    await StudyMaterial.findByIdAndUpdate(
      material._id,
      {
        courseLayout: { chapters: updatedChapters },
        notes: true,
      },
      { runValidators: true }
    );

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

    const prompt = `Generate study material for the topic "${topic}" for an ${courseType}. The difficulty level should be ${difficultyLevel}. The study material must adhere to the following structure and constraints:

- The output must be a **single valid JSON object**. Do not include any additional text, explanations, or formatting outside the JSON structure.
- The JSON object should have the following fields:
  - course_summary: A string containing a detailed summary of the entire course.
  - image_url: A string containing a single URL that represents the topic '${topic}'.
  - chapters: An array, where each element is an object with:
    - title: A string representing the chapter's title.
    - topics: An array of strings, where each string is the name of a topic within the chapter.

The JSON output must follow this exact structure and format. No extraneous characters or non-JSON output should be included.`;

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
