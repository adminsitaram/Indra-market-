
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  // Refactor: GoogleGenAI instance should be created per-call to ensure latest API key usage as per guidelines
  async getDashboardInsights(data: any): Promise<string> {
    try {
      // Create a new instance right before the API call using process.env.API_KEY
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // Using Gemini 3 Pro for complex business data reasoning
        contents: `Analyze the following dashboard data and provide 3 brief, actionable business insights. Data: ${JSON.stringify(data)}`,
        config: {
          systemInstruction: "You are a senior business data analyst. Keep insights professional, concise, and focused on growth.",
          temperature: 0.7,
        },
      });

      // Directly access .text property from GenerateContentResponse
      return response.text || "No insights available at this time.";
    } catch (error) {
      console.error("Gemini Insight Error:", error);
      return "Failed to generate AI insights. Please check your connection.";
    }
  }
}

export const geminiService = new GeminiService();
