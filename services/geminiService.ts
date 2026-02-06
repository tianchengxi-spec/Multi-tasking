import { GoogleGenAI } from "@google/genai";

export const getGeminiResponse = async (prompt: string, context: string) => {
  try {
    // Initialize GoogleGenAI inside the function using process.env.API_KEY directly as required by guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Context about the current tablet workspace: ${context}\n\nUser Question: ${prompt}`,
      config: {
        systemInstruction: "You are 'Nexus AI', a smart OS assistant for a high-end multi-tasking tablet. Help the user manage their tasks, summarize notes, or explain UI features. Keep responses concise and helpful.",
        temperature: 0.7,
      },
    });
    // Use the .text property directly to extract content from the response
    return response.text || "I'm sorry, I couldn't process that.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to Nexus AI core.";
  }
};