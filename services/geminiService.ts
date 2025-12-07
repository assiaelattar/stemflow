import { GoogleGenAI } from "@google/genai";

// Initialize the client
// NOTE: API Key must be provided in environment variables for production
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMenuDescription = async (itemName: string, category: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key missing. Returning mock description.");
    return `Delicious ${itemName} prepared fresh daily. A classic ${category} option.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a short, appetizing menu description (max 20 words) for a restaurant item named "${itemName}" in the category "${category}".`,
    });
    return response.text || `Fresh ${itemName}.`;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `Enjoy our tasty ${itemName}.`;
  }
};

export const analyzeSales = async (orders: any[]): Promise<string> => {
    if (!process.env.API_KEY) return "AI insights unavailable without API key.";
    
    try {
        const orderSummary = JSON.stringify(orders.slice(0, 20)); // Limit context
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze these recent orders and give 3 strategic tips for the restaurant owner to improve sales. Data: ${orderSummary}`,
        });
        return response.text || "No insights available.";
    } catch (e) {
        return "Error generating insights.";
    }
}