
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  /**
   * Chat bot for user support
   */
  async getChatResponse(history: ChatMessage[], message: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
          ...history,
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: "You are the Avalon Games Support AI named 'AV-L0N'. You help users with top-up issues, game information, and account queries in a helpful, futuristic, and tech-focused tone.",
        },
      });
      return response.text || "I'm having trouble processing that signal. Please try again.";
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      return "Mainframe link lost. Please check your connection.";
    }
  },

  /**
   * AI-powered image editing (Nano Banana)
   */
  async editImage(base64Image: string, prompt: string): Promise<string | null> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/png' } },
            { text: prompt }
          ]
        }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error("Gemini Image Error:", error);
      return null;
    }
  }
};
