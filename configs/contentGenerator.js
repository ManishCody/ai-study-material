import { chatSession } from "@/configs/AIModel"; // AI chat session for generating content

export async function generateChapterContent(prompt) {
  try {
    const aiResponse = await chatSession.sendMessage(prompt);
    return JSON.parse(aiResponse.response.text());
  } catch (error) {
    console.error("Error generating chapter content:", error);
    throw new Error("Failed to generate chapter content.");
  }
}
