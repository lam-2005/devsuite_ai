import { GoogleGenAI } from "@google/genai";
import ENV from "../config/env.js";
import systemInstruction from "../lib/systemInstruction.js";

const genAI = new GoogleGenAI({
  apiKey: ENV.GEMINI_API_KEY || "",
});

export const analyzeErrorWithGemini = async (
  error_message: string,
  stack_trace: string,
  target_language: string,
) => {
  try {
    const dynamicPrompt = `
        [TARGET_LANGUAGE]: ${target_language}
        [ERROR_MESSAGE]: ${error_message}
        [STACK_TRACE]: ${stack_trace}
    `;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: dynamicPrompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: systemInstruction,
      },
    });
    const jsonText =
      typeof response?.text === "string" ? response.text.trim() : "";

    if (!jsonText) {
      throw new Error("Empty or undefined response.text from Gemini");
    }

    // Ép thành Object và trả về
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error occurred while analyzing error with Gemini:", error);
    throw error;
  }
};
