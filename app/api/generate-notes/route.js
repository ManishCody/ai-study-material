import { chatSession } from "@/configs/AIModel";
import { NextResponse } from "next/server";
import dbConnect from "@/configs/db";
import StudyMaterial from "@/models/StudyMaterial";

// Utility to parse AI response
function parseAIResponse(responseText) {
  if (!responseText) {
    console.error("Empty or undefined response from AI service.");
    return null;
  }

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
      const controller = new AbortController();
      const aiResp = await chatSession.sendMessage(prompt, { signal: controller.signal });
      const rawResponse = await aiResp.response.text();

      if (!rawResponse.trim()) {
        throw new Error("AI service returned an empty response.");
      }

      const parsedResponse = parseAIResponse(rawResponse);

      if (!parsedResponse) {
        throw new Error("Parsed response is null or invalid.");
      }

      return parsedResponse;
    } catch (error) {
      const isRateLimited = error?.response?.status === 429;
      const shouldRetry = isRateLimited || error.message.includes("empty response");

      if (shouldRetry && attempt < MAX_RETRIES) {
        const backoffTime = RETRY_DELAY_MS * Math.pow(2, attempt);
        console.warn(`Retry attempt ${attempt}/${MAX_RETRIES}. Backing off for ${backoffTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
      } else {
        console.error("Failed to fetch AI response after retries:", error);
        throw error;
      }
    }
  }
  throw new Error("Failed after maximum retries.");
}

// Adding a timeout mechanism to the AI request
async function generateChapterNotes({ topics, chatSession }) {
  const updatedTopics = [];
  const fallbackResponse = {
    chapters: [
      {
        title: "Untitled Chapter",
        topics: [
          {
            title: "Untitled Topic",
            htmlContent: {
              summary: "No summary available.",
              keyPoints: [],
            },
          },
        ],
      },
    ],
  };

  const parseAIResponse = (response) => {
    try {
      return JSON.parse(response);
    } catch (error) {
      console.error("Error parsing AI response:", response, error);
      return null;
    }
  };

  const transformAIResponse = (parsedResponse) => {
    try {
      return parsedResponse.chapters.map((chapter) => ({
        title: chapter.title,
        topics: chapter.topics.map((topic) => ({
          title: topic.title,
          htmlContent: {
            summary: topic.summary,
            keyPoints: topic.keyPoints || [],
          },
        })),
      }));
    } catch (error) {
      console.error("Error transforming AI response:", parsedResponse, error);
      return fallbackResponse.chapters;
    }
  };

  for (const topic of topics) {
    const message = {
      content: JSON.stringify({
        chapters: [
          {
            topics: [{ title: topic.title, summary: topic.summary }],
          },
        ],
      }),
    };

    try {
      const chapterContent = await chatSession.sendMessage(message);

      // Extract raw response
      const rawResponse = await chapterContent.response.text();
      console.log("Raw AI Response:", rawResponse);

      // Clean the response
      const cleanedResponse = rawResponse.replace(/[^\n\t\r\x20-\x7E]+/g, "");

      // Parse and validate the response
      let parsedResponse = parseAIResponse(cleanedResponse);
      if (!parsedResponse) {
        console.error("Invalid AI response. Using fallback content.");
        parsedResponse = fallbackResponse;
      }

      // Transform the response
      const transformedContent = transformAIResponse(parsedResponse);

      updatedTopics.push({
        title: transformedContent[0]?.topics[0]?.title || topic.title,
        htmlContent: {
          summary:
            transformedContent[0]?.topics[0]?.htmlContent?.summary ||
            "Summary not available.",
          keyPoints:
            transformedContent[0]?.topics[0]?.htmlContent?.keyPoints || [],
        },
      });
    } catch (error) {
      console.error(
        `Error generating notes for topic "${topic.title}":`,
        error
      );
      updatedTopics.push({
        title: topic.title,
        htmlContent: {
          summary: "An error occurred while generating the summary.",
          keyPoints: [],
        },
      });
    }
  }

  return updatedTopics;
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
      { error: error || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
