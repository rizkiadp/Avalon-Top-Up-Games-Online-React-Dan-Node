
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  /**
   * Chat bot for user support
   */
  async getChatResponse(history: ChatMessage[], message: string): Promise<string> {
    try {
      // Attempt to use Gemini API
      // Using a widely available model alias
      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [
          ...history.map(msg => ({ role: msg.role, parts: [{ text: msg.parts[0].text }] })),
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: {
            parts: [{ text: "You are AV-L0N, the advanced AI support unit for Avalon Games Ecosystem. Your tone is futuristic, professional, and helpful. You have deep knowledge of our secure AES-256 encryption, RIZKIADP Core infrastructure, and instant top-up services. Keep responses concise but impressive." }]
          }
        },
      });
      return response.text() || this.getFallbackResponse(message);
    } catch (error) {
      console.warn("Gemini API unavailable, switching to local database:", error);
      return this.getFallbackResponse(message);
    }
  },

  getFallbackResponse(query: string): string {
    const lower = query.toLowerCase();

    if (lower.includes('halo') || lower.includes('hi') || lower.includes('hello')) {
      return "System Online. Greetings, Operator. I am AV-L0N, your dedicated support interface. How may I assist you in navigating the Avalon Games Ecosystem today?";
    }

    if (lower.includes('aman') || lower.includes('trust') || lower.includes('scam')) {
      return "Security Protocol: VERIFIED. Avalon Games Ecosystem operates on a secure server-side automated infrastructure. We utilize AES-256 encryption and RIZKIADP Core technology to ensure every transaction is processed safely and instantly. Your assets are our top priority.";
    }

    if (lower.includes('lama') || lower.includes('waktu') || lower.includes('jam')) {
      return "Time Efficiency Analysis: Optimal. Our standard processing time is 1-3 seconds per transaction after payment verification. In rare cases of high network density, latency may reach up to 60 seconds.";
    }

    if (lower.includes('bayar') || lower.includes('payment') || lower.includes('metode')) {
      return "Payment Gateways: Active. We support instant QRIS (All E-Wallets/Mobile Banking), as well as direct Virtual Account transfers for BCA, Mandiri, BNI, and BRI. All payment channels are monitored 24/7.";
    }

    if (lower.includes('bantuan') || lower.includes('cs') || lower.includes('admin') || lower.includes('support')) {
      return "Support Uplink: Available. If you require manual intervention, please contact our Human Operators via email at support@avalon-games.com or through our official WhatsApp business channel. Please have your Transaction ID ready for rapid resolution.";
    }

    if (lower.includes('owner') || lower.includes('pemilik') || lower.includes('siapa')) {
      return "Identity: Avalon Games Ecosystem is powered by RIZKIADP. Designed to revolutionize the digital content distribution grid.";
    }

    // Default Fallback
    return "Query unclear. My local database suggests you might be asking about our Security, Payment Methods, or Transaction Processing. Could you specify your inquiry parameter?";
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
