
import { GoogleGenAI, Type } from "@google/genai";
import { Business } from "../types";

const API_KEY = process.env.API_KEY || "";

export const getSmartSearchResponse = async (query: string, businesses: Business[]) => {
  if (!API_KEY) return null;
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const prompt = `
    Dada a seguinte lista de empresas em Itupeva:
    ${JSON.stringify(businesses.map(b => ({ name: b.name, category: b.category, desc: b.description })))}
    
    O usuário buscou por: "${query}"
    
    Identifique quais empresas melhor correspondem a essa busca, mesmo que a busca seja por intenção (ex: "estou com fome", "preciso consertar meu carro").
    Retorne apenas um array JSON com os nomes das empresas correspondentes.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Search Error:", error);
    return null;
  }
};
